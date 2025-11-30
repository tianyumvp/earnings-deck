export const getServerSideProps = ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://briefingdeck.com';

  const pages = [
    '',
    '/privacy',
    '/terms',
  ];

  const urls = pages
    .map(
      (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap.trim());
  res.end();

  return { props: {} };
};

export default function SiteMap() {
  return null;
}
