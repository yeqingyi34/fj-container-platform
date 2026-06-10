#!/usr/bin/env python3
"""Generate full sitemap with all provinces and companies"""
import requests, sys

pub_url = "https://ozweqrecqfcwxynhuobd.supabase.co"
pub_key = "sb_publishable_ZN3Gqf_7YXg9_64IoD8Pfg_w0QRtN3d"

base = "https://dd-construction-project.com"

print('<?xml version="1.0" encoding="UTF-8"?>')
print('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

# Homepage
print(f'<url><loc>{base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>')
print(f'<url><loc>{base}/search</loc><changefreq>daily</changefreq><priority>0.9</priority></url>')

# Provinces
r = requests.get(f"{pub_url}/rest/v1/provinces?select=slug", headers={"apikey": pub_key})
for p in r.json():
    print(f'<url><loc>{base}/province/{p["slug"]}</loc><priority>0.8</priority></url>')

# Companies
r2 = requests.get(f"{pub_url}/rest/v1/companies?select=slug", headers={"apikey": pub_key})
for c in r2.json():
    print(f'<url><loc>{base}/company/{c["slug"]}</loc><priority>0.7</priority></url>')

print('</urlset>')
