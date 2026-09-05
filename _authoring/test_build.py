import importlib.util
from pathlib import Path
import tempfile, unittest
MODULE=Path(__file__).with_name('build.py')

class BuildTests(unittest.TestCase):
    def test_markdown_post_renders_into_existing_card(self):
        self.assertTrue(MODULE.exists(), 'The Markdown builder has not been implemented')
        spec=importlib.util.spec_from_file_location('site_build',MODULE)
        assert spec is not None and spec.loader is not None
        mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);(root/'photos').mkdir();(root/'photos/test.jpg').write_bytes(b'test')
            path=root/'post.md'
            path.write_text('''---
id: coop
title: building chicken coop
category: building
tag: Building
date: ""
order: 1
accent: lime
specs:
  Date: Date to come
---
My **own words**, not polished.

![The coop](photos/test.jpg)

[Useful link](https://example.com)
''')
            post=mod.read_post(path)
            html=mod.render_post(post,root,1)
            self.assertIn('id="coop"',html)
            self.assertIn('<strong>own words</strong>',html)
            self.assertIn('class="screen"',html)
            self.assertIn('photos/test.jpg',html)
            self.assertIn('https://example.com',html)
            self.assertNotIn('data-date="ongoing"',html)

    def test_build_preserves_shell_and_refuses_manual_generated_edits(self):
        spec=importlib.util.spec_from_file_location('site_build',MODULE)
        assert spec is not None and spec.loader is not None
        mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
        self.assertTrue(hasattr(mod,'build'),'Need safe build orchestration')
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for folder,page in mod.PAGES.items():
                (root/'_posts'/folder).mkdir(parents=True)
                (root/page).write_text('before\n'+mod.START+'\nold\n'+mod.END+'\nafter')
                (root/'_posts'/folder/'01-test.md').write_text('---\nid: test\ntitle: My test\ncategory: books\n---\nMy words.')
            mod.build(root,bootstrap=True)
            page=root/'projects.html';built=page.read_text()
            self.assertTrue(built.startswith('before\n') and built.endswith('\nafter'))
            self.assertIn('My words.',built)
            mod.build(root,check=True)
            page.write_text(built.replace('My words.','Unsaved migration risk'))
            with self.assertRaisesRegex(ValueError,'edited directly'):
                mod.build(root)
            self.assertIn('Unsaved migration risk',page.read_text())

    def test_unsafe_input_and_missing_photos_leave_pages_unchanged(self):
        spec=importlib.util.spec_from_file_location('site_build',MODULE)
        assert spec is not None and spec.loader is not None
        mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for folder,page in mod.PAGES.items():
                (root/'_posts'/folder).mkdir(parents=True)
                (root/page).write_text(mod.START+'\n'+mod.END)
                (root/'_posts'/folder/'one.md').write_text('---\nid: test\ntitle: Test\ncategory: books\n---\nMy words.')
            mod.build(root,bootstrap=True)
            snapshots={page:(root/page).read_bytes() for page in mod.PAGES.values()}
            f=root/'_posts/gardening/one.md';original=f.read_text()
            f.write_text(original+'\n\n![Missing](photos/nope.jpg)')
            with self.assertRaises(ValueError):mod.build(root)
            self.assertEqual(snapshots,{page:(root/page).read_bytes() for page in mod.PAGES.values()})
            f.write_text(original)
            for value in ['../../outside.txt','file:///etc/passwd','javascript:alert(1)','//example.com/x']:
                with self.assertRaises(ValueError):mod.check_url(value,root)
            escaped=mod.markdown('<script>alert(1)</script>',root)
            self.assertNotIn('<script>',escaped)
            # Exercise a real author edit and new post through the builder.
            f.write_text(original.replace('My words.','New **writing**.'))
            new=root/'_posts/wood/two.md'
            new.write_text(original.replace('id: test','id: second'))
            mod.build(root)
            self.assertIn('<strong>writing</strong>',(root/'gardening.html').read_text())
            self.assertIn('id="second"',(root/'projects.html').read_text())
            # Duplicated IDs and malformed metadata are rejected.
            new.write_text(original)
            with self.assertRaisesRegex(ValueError,'duplicate'):mod.build(root)
            new.write_text('No header')
            with self.assertRaises(ValueError):mod.build(root)

if __name__=='__main__':unittest.main()
