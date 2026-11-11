from pathlib import Path
from urllib.parse import urlsplit, quote
from html import escape
import sys, json, re
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parent
url=sys.argv[1].strip() if len(sys.argv)>1 else json.loads((root/'seo-config.json').read_text(encoding='utf-8')).get('base_url','').strip()
u=urlsplit(url)
if u.scheme!='https' or not u.netloc or u.query or u.fragment:
    raise SystemExit('Indique o URL publico HTTPS exato, incluindo a pasta do GitHub Pages quando aplicavel. Exemplo de uso: python configurar-seo.py URL_PUBLICO')
url=url.rstrip('/')+'/'
manifest=json.loads((root/'seo-paginas.json').read_text(encoding='utf-8'))
ns='http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('',ns)
site=ET.Element('{'+ns+'}urlset')
langs={'pt':'pt-PT','en':'en','es':'es','fr':'fr'}
def canonical_name(name):
    if name.endswith('/Inicio.html') or name=='Inicio.html': return name[:-len('Inicio.html')]+'index.html'
    if name.endswith('/Loja.html') or name=='Loja.html': return name[:-len('Loja.html')]+'Portfolio.html'
    return name
def absolute(name):
    name=canonical_name(name)
    if name.endswith('index.html'): name=name[:-len('index.html')]
    return url+quote(name,safe='/')
for name,info in manifest.items():
    p=root/name
    text=p.read_text(encoding='utf-8')
    text=re.sub(r'<link\b[^>]*\brel=["\x27](?:canonical|alternate)["\x27][^>]*>','',text,flags=re.I)
    # BeautifulSoup may serialize rel before or after href; the pattern covers either ordering.
    text=re.sub(r'<meta\b[^>]*\bproperty=["\x27]og:url["\x27][^>]*>','',text,flags=re.I)
    name_c=canonical_name(name)
    stem=name_c.split('/')[-1]
    tags='<link rel="canonical" href="'+escape(absolute(name),quote=True)+'">\n'
    tags+='<meta property="og:url" content="'+escape(absolute(name),quote=True)+'">\n'
    for lang,code in langs.items():
        other=('' if lang=='pt' else lang+'/')+stem
        if other in manifest:tags+='<link rel="alternate" hreflang="'+code+'" href="'+escape(absolute(other),quote=True)+'">\n'
    pt=stem
    if pt in manifest:tags+='<link rel="alternate" hreflang="x-default" href="'+escape(absolute(pt),quote=True)+'">\n'
    text=re.sub(r'</head\s*>',lambda m:tags+m.group(),text,count=1,flags=re.I)
    p.write_text(text,encoding='utf-8')
    if name==name_c:
        node=ET.SubElement(site,'{'+ns+'}url')
        ET.SubElement(node,'{'+ns+'}loc').text=absolute(name)
ET.ElementTree(site).write(root/'sitemap.xml',encoding='utf-8',xml_declaration=True)
(root/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /componentes/\n\nSitemap: '+url+'sitemap.xml\n',encoding='utf-8')
(root/'seo-config.json').write_text(json.dumps({'base_url':url},ensure_ascii=False,indent=2),encoding='utf-8')
print('SEO de dominio configurado. Sitemap com',len(site),'URLs. Publique os HTML, sitemap.xml e robots.txt atualizados.')
