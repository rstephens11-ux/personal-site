#!/usr/bin/env python3
"""Render Markdown posts into existing static page shells. Never publishes."""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path
from urllib.parse import urlsplit, unquote

import yaml
from bs4 import BeautifulSoup
from markdown_it import MarkdownIt

MD = MarkdownIt('commonmark', {'html': False})
PAGES = {'wood': 'projects.html', 'jawnz': 'other.html', 'gardening': 'gardening.html', 'links': 'links.html'}
START = '<!-- GENERATED POSTS: edit _posts, not this block -->'
END = '<!-- END GENERATED POSTS -->'


def read_post(path):
    text = path.read_text()
    parts = text.split('---', 2) if text.startswith('---\n') else []
    if len(parts) != 3:
        raise ValueError(f'{path}: expected --- details --- then post text')
    meta = yaml.safe_load(parts[1])
    if not isinstance(meta, dict):
        raise ValueError(f'{path}: details must be name: value pairs')
    for key in ('id', 'title', 'category'):
        if not isinstance(meta.get(key), str) or not meta[key].strip():
            raise ValueError(f'{path}: missing {key}')
    for key in ('id', 'category'):
        if not re.fullmatch(r'[a-z][a-z0-9-]*', meta[key]):
            raise ValueError(f'{path}: {key} must be lowercase words joined by hyphens')
    date = str(meta.get('date', ''))
    if date and date != 'ongoing' and not re.fullmatch(r'\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?', date):
        raise ValueError(f'{path}: date must be YYYY-MM, YYYY-MM-DD, ongoing, or empty')
    accent = meta.get('accent', 'lime')
    if accent not in ('lime', 'coral', 'gold', 'sky'):
        raise ValueError(f'{path}: invalid accent')
    if not isinstance(meta.get('order', 0), int):
        raise ValueError(f'{path}: order must be a whole number')
    meta['date'] = date
    meta['body'] = parts[2].strip()
    meta['path'] = str(path)
    return meta


def check_url(value, root, image=False):
    parts = urlsplit(value)
    if parts.scheme:
        if parts.scheme not in (('https', 'http') if image else ('https', 'http', 'mailto')):
            raise ValueError(f'Unsafe URL: {value}')
        if image:
            raise ValueError('Photos must be local files in photos/')
        return
    if parts.netloc or value.startswith('/'):
        raise ValueError(f'Use a site-relative path: {value}')
    if parts.path:
        target = (root / unquote(parts.path)).resolve()
        if not target.is_relative_to(root.resolve()) or not target.is_file():
            raise ValueError(f'Missing or outside-site file: {value}')
        if image and not target.is_relative_to((root / 'photos').resolve()):
            raise ValueError('Photos must live in photos/')


def markdown(text, root, inline=False):
    rendered = MD.renderInline(str(text)) if inline else MD.render(str(text))
    soup = BeautifulSoup(rendered, 'html.parser')
    for a in soup.find_all('a'):
        check_url(a['href'], root)
    for img in soup.find_all('img'):
        check_url(img['src'], root, image=True)
    # Consecutive photo-only paragraphs form one existing .screen gallery.
    for paragraph in list(soup.find_all('p')):
        images = paragraph.find_all('img', recursive=False)
        if images and all(getattr(c, 'name', None) == 'img' or (isinstance(c, str) and not c.strip()) for c in paragraph.contents):
            gallery = soup.new_tag('div', attrs={'class': 'screen'})
            for image in images:
                figure = soup.new_tag('figure'); figure.append(image.extract()); gallery.append(figure)
            paragraph.replace_with(gallery)
    for gallery in list(soup.select('div.screen')):
        prev = gallery.find_previous_sibling()
        if prev and prev.get('class') == ['screen']:
            for child in list(gallery.contents):
                prev.append(child.extract())
            gallery.decompose()
    return str(soup).strip()


def render_post(post, root, number):
    e = lambda v: html.escape(str(v), quote=True)
    body = markdown(post['body'], root)
    destination = post.get('url', '')
    if destination:
        parsed = urlsplit(destination)
        if parsed.scheme not in ('https', 'http') or not parsed.netloc:
            raise ValueError(f'{post["path"]}: URL must be a full http(s) address')
        check_url(destination, root)
        label = {'websites': 'Visit website', 'books': 'View book', 'twitter': 'View Twitter post', 'youtube': 'Visit YouTube channel'}.get(post['category'], 'Visit link')
        body = f'<p class="collection-source">{e(parsed.netloc)}</p>' + body + f'<p><a class="collection-destination" href="{e(destination)}">{label} ↗</a></p>'

    if post.get('layout') == 'side-by-side':
        check_url(post['image'], root, image=True)
        body = f'<div class="side-by-side"><img src="{e(post["image"])}" alt="{e(post.get("image_alt", ""))}"><div>{body}</div></div>'
    specs = post.get('specs', {})
    if not isinstance(specs, dict):
        raise ValueError(f'{post["path"]}: specs must be name: value pairs')
    if specs:
        body += '\n<div class="specs">' + ''.join(f'<div class="spec"><span class="k">{e(k)}</span><span class="v">{markdown(v, root, inline=True)}</span></div>' for k, v in specs.items()) + '</div>'
    date = f' data-date="{e(post["date"])}"' if post.get('date') else ''
    heading = f' id="{e(post["heading_id"])}"' if post.get('heading_id') else ''
    return f'<article class="record r-{e(post.get("accent", "lime"))}" id="{e(post["id"])}" data-category="{e(post["category"])}"{date}><div class="r-head"><span class="no">{number:02d}</span><h3{heading}>{e(post["title"])}</h3><span class="tag">{e(post.get("tag", ""))}</span></div><div class="body">{body}</div></article>'


def digest(text):
    return hashlib.sha256(text.encode()).hexdigest()


def build(root, check=False, bootstrap=False):
    root = Path(root).resolve()
    state_path = root / '.build-state.json'
    state = json.loads(state_path.read_text()) if state_path.exists() else {}
    outputs, new_state, counts = {}, {}, {}
    # Validate every post/page before writing any output.
    for folder, filename in PAGES.items():
        page = root / filename
        source = page.read_text()
        if source.count(START) != 1 or source.count(END) != 1:
            raise ValueError(f'{filename}: generated markers missing or duplicated; refusing to overwrite')
        before, remainder = source.split(START)
        current, after = remainder.split(END)
        if not check and not bootstrap and filename in state and digest(current) != state[filename]:
            raise ValueError(f'{filename}: generated post HTML was edited directly. Move those changes into _posts first; nothing overwritten.')
        files = sorted((root / '_posts' / folder).glob('*.md'))
        if not files and folder != 'links':
            raise ValueError(f'No posts in _posts/{folder}; refusing accidental empty-page build')
        posts = [read_post(p) for p in files]
        if folder == 'links':
            for post in posts:
                if post['category'] not in ('websites', 'books', 'twitter', 'youtube'):
                    raise ValueError(f'{post["path"]}: use category websites, books, twitter, or youtube')
                if post['category'] in ('websites', 'twitter', 'youtube') and not post.get('url'):
                    raise ValueError(f'{post["path"]}: this entry needs a URL')
                post.setdefault('tag', {'websites':'Website', 'books':'Book', 'twitter':'Twitter post', 'youtube':'YouTube channel'}[post['category']])

        posts.sort(key=lambda p: (p.get('order', 0), p['path']))
        ids = [p['id'] for p in posts] + [p['heading_id'] for p in posts if p.get('heading_id')]
        if len(ids) != len(set(ids)):
            raise ValueError(f'{folder}: duplicate post/heading ID')
        shell = BeautifulSoup(before + after, 'html.parser')
        if set(ids) & {n['id'] for n in shell.select('[id]')}:
            raise ValueError(f'{folder}: post ID conflicts with page element')
        categories = {b['data-filter'] for b in shell.select('button[data-filter]')}
        if categories:
            for post in posts:
                if post['category'] not in categories:
                    raise ValueError(f'{post["path"]}: category has no matching filter button')
        generated = '\n' + '\n'.join(render_post(post, root, i) for i, post in enumerate(posts, 1)) + '\n'
        if check and generated != current:
            raise ValueError(f'{filename} is out of date. Run Update Preview.command before publishing.')
        if not check and not bootstrap and filename not in state and generated != current:
            raise ValueError(f'{filename}: no safe build baseline. Run --check on a clean checkout first.')
        outputs[page] = before + START + generated + END + after
        new_state[filename] = digest(generated)
        counts[folder] = len(posts)
    if not check:
        for page, text in outputs.items():
            if page.read_text() != text:
                temporary = page.with_suffix('.html.tmp')
                temporary.write_text(text)
                temporary.replace(page)
    state_path.write_text(json.dumps(new_state, indent=2) + '\n')
    print(('Checked' if check else 'Built') + ': ' + ', '.join(f'{n} {k} posts' for k, n in counts.items()))
    return counts


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument('--check', action='store_true', help='Verify generated pages match Markdown')
    args = parser.parse_args()
    try:
        build(args.root, check=args.check)
    except (ValueError, KeyError, OSError, yaml.YAMLError) as error:
        parser.exit(1, f'Not built: {error}\n')
