import urllib.request
import re

def get_image(keyword):
    url = f"https://unsplash.com/s/photos/{keyword.replace(' ', '-')}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9\-]+', html)
        if match:
            return match.group(0) + "?q=80&w=200&auto=format&fit=crop"
    except Exception as e:
        print(f"Error for {keyword}: {e}")
    return None

print("Smile:", get_image("smile teeth"))
print("Oil Drop:", get_image("oil drop"))
print("Self Massage:", get_image("self massage"))
