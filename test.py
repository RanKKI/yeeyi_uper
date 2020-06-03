import requests
s = requests.Session()

s.headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Safari/605.1.15"
}

username = "0405798475"
password = "'eW3msBj2k9qd8"

login_url = "https://www.yeeyi.com/forum/index.php?app=member&act=dologin"


data = {"username": username, "password": password, "sms": ""}

s.get("https://www.yeeyi.com")
# resp = s.post(login_url, data=data)

# check_url = "https://www.yeeyi.com/addon/checklogin.php"
# s.get("https://www.yeeyi.com")
# resp = s.get(check_url)

# print(resp.text)
