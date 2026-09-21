<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"
    doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap — slaega</title>
        <style>
          :root{ --ink:#14213D; --muted:#5B6473; --accent:#0D9488; --line:#E3E7EC; --bg:#FAF8F4; --card:#FFFFFF; }
          *{ box-sizing:border-box; }
          body{ margin:0; background:var(--bg); color:var(--ink);
            font-family:"Segoe UI", system-ui, -apple-system, Arial, sans-serif; font-size:14px; line-height:1.5; }
          .wrap{ max-width:1100px; margin:0 auto; padding:32px 20px 64px; }
          header{ border-bottom:2px solid var(--accent); padding-bottom:16px; margin-bottom:24px; }
          h1{ margin:0; font-size:24px; letter-spacing:.2px; }
          .sub{ color:var(--muted); margin-top:6px; font-size:13px; }
          .sub a{ color:var(--accent); text-decoration:none; }
          .count{ display:inline-block; background:var(--accent); color:#fff; font-weight:700;
            border-radius:999px; padding:2px 10px; font-size:12px; margin-left:6px; }
          table{ width:100%; border-collapse:collapse; background:var(--card);
            border:1px solid var(--line); border-radius:10px; overflow:hidden; }
          th,td{ text-align:left; padding:10px 12px; border-bottom:1px solid var(--line); vertical-align:top; }
          th{ background:#F1F5F4; font-size:11px; text-transform:uppercase; letter-spacing:.6px; color:var(--muted); }
          tr:last-child td{ border-bottom:none; }
          tr:hover td{ background:#F7FAF9; }
          td.url a{ color:#0B5D57; text-decoration:none; word-break:break-all; font-weight:600; }
          td.url a:hover{ text-decoration:underline; }
          .langs span{ display:inline-block; background:#EAF3F2; color:#0B5D57; border-radius:4px;
            padding:1px 6px; font-size:11px; font-weight:600; margin:0 4px 2px 0; text-transform:uppercase; }
          .num{ font-variant-numeric:tabular-nums; color:var(--muted); white-space:nowrap; }
          footer{ color:var(--muted); font-size:12px; margin-top:20px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <h1>XML Sitemap<span class="count"><xsl:value-of select="count(s:urlset/s:url)"/></span></h1>
            <div class="sub">
              Generated for search engines by
              <a href="https://slaega.com">slaega.com</a>. This page is a readable view of the XML sitemap.
            </div>
          </header>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Languages</th>
                <th>Last modified</th>
                <th>Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="url">
                    <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                  </td>
                  <td class="langs">
                    <xsl:for-each select="xhtml:link">
                      <span><xsl:value-of select="@hreflang"/></span>
                    </xsl:for-each>
                  </td>
                  <td class="num"><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td>
                  <td class="num"><xsl:value-of select="s:changefreq"/></td>
                  <td class="num"><xsl:value-of select="s:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <footer>
            Tip: this styled view is for humans — crawlers read the raw XML and ignore the stylesheet.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
