import tempfile, unittest
from pathlib import Path
import build

class LinksTests(unittest.TestCase):
    def test_website_card_has_destination_and_notes(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            post={'id':'example','title':'Example','category':'websites','url':'https://example.com/a?b=1&c=2','body':'My **notes**.','path':'test','accent':'sky'}
            result=build.render_post(post,root,1)
            self.assertIn('class="collection-destination"',result)
            self.assertIn('https://example.com/a?b=1&amp;c=2',result)
            self.assertIn('<strong>notes</strong>',result)

    def test_empty_collection_and_three_entry_types(self):
        self.assertEqual(build.PAGES.get('links'),'links.html')
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for folder,page in build.PAGES.items():
                (root/'_posts'/folder).mkdir(parents=True)
                (root/page).write_text(build.START+'\n'+build.END)
                if folder!='links':
                    (root/'_posts'/folder/'test.md').write_text('---\nid: test\ntitle: Test\ncategory: general\n---\nText.')
            counts=build.build(root,bootstrap=True)
            self.assertEqual(counts['links'],0)
            for category,url in [('websites','https://example.com'),('books',''),('twitter','https://x.com/example/status/123')]:
                f=root/'_posts/links'/f'{category}.md'
                f.write_text(f'---\nid: {category}\ntitle: Test {category}\ncategory: {category}\nurl: "{url}"\n---\nMy notes.')
            counts=build.build(root)
            self.assertEqual(counts['links'],3)
            (root/'_posts/links/websites.md').write_text('---\nid: website\ntitle: Test\ncategory: websites\n---\nNotes')
            with self.assertRaises(ValueError):build.build(root)

    def test_youtube_channel_builds_with_destination_and_requires_url(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for folder,page in build.PAGES.items():
                (root/'_posts'/folder).mkdir(parents=True)
                (root/page).write_text(build.START+'\n'+build.END)
                category='youtube' if folder=='links' else 'general'
                url='\nurl: https://www.youtube.com/@example' if folder=='links' else ''
                (root/'_posts'/folder/'test.md').write_text(f'---\nid: test\ntitle: Test\ncategory: {category}{url}\n---\nChannel notes.')
            build.build(root,bootstrap=True)
            result=(root/'links.html').read_text()
            self.assertIn('Visit YouTube channel',result)
            self.assertIn('YouTube channel</span>',result)
            self.assertIn('Channel notes.',result)
            channel=root/'_posts/links/test.md'
            channel.write_text(channel.read_text().replace('\nurl: https://www.youtube.com/@example',''))
            with self.assertRaisesRegex(ValueError,'needs a URL'):build.build(root)

if __name__=='__main__':unittest.main()
