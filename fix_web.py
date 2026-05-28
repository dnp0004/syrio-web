import urllib.request
import re

base_url = "http://localhost:8080/"
pages = [("", "index.html"), ("privacidad", "privacidad.html"), ("terminos", "terminos.html"), ("cookies", "cookies.html")]
target_dir = "C:/Users/navas/Projects/syrio-web-static/"

for path, filename in pages:
    try:
        response = urllib.request.urlopen(base_url + path)
        html = response.read().decode('utf-8')
        
        # Common replaces
        html = html.replace('href="/css/', 'href="./css/')
        html = html.replace('src="/images/', 'src="./images/')
        html = html.replace('href="/images/', 'href="./images/')
        html = html.replace('href="/#', 'href="#')
        html = html.replace('href="/privacidad"', 'href="privacidad.html"')
        html = html.replace('href="/terminos"', 'href="terminos.html"')
        html = html.replace('href="/cookies"', 'href="cookies.html"')
        html = html.replace('href="/blog"', 'href="#"')
        
        if filename == "index.html":
            html = re.sub(r'(<!-- =+\s+NEWSLETTER\s+=+ -->\s*)<section class="section">', r'\g<1><section class="section" style="display:none;">', html)
            html = re.sub(r'<!-- =+\s+BLOG \(LATEST POSTS\)\s+=+ -->\s*<section class="section bg-light" id="blog">.*?</section>', '', html, flags=re.DOTALL)
            html = html.replace('feature-card feature-large', 'feature-card')
            
        with open(target_dir + filename, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Fixed {filename}")
    except Exception as e:
        print(f"Error on {filename}: {e}")
