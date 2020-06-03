import re
import requests

from urllib import parse
from requests.exceptions import RequestException
from lxml import etree
from selenium import webdriver
from web_app.database import Record, Log
from datetime import datetime, timedelta


class NoTimeLeftError(Exception):
    pass


class PostWasRemovedOrCookiesError(Exception):
    pass


class Yeeyi(object):
    BASE_URL = "http://www.yeeyi.com/bbs/forum.php"

    def __init__(self, record: Record):
        self.session = requests.session()
        self.record = record
        self.perpare()

    def perpare(self):
        self.session.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36",
            "Host": "www.yeeyi.com",
            "Connection": "keep-alive",
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "*/*",
            "Referer": "http://www.yeeyi.com/forum/index.php",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Cookies": self.record.cookies.encode("utf8", "replace")
        }

    def up(self):
        tid = self.record.tid
        now = datetime.now()
        if not self.record.cookies or self.record.count >= 8:
            self.record.count = 0
            self.login()
            self.perpare()
        try:
            time_left = self.__up()
            next_time = None
        except RequestException:
            next_time = (now + timedelta(minutes=10)).strftime("%H:%M")
            Log.new(tid, "Error Network error")
        except ValueError as e:
            next_time = (now + timedelta(minutes=5)).strftime("%H:%M")
            Log.new(tid, e)
        except NoTimeLeftError:
            next_time = f"{self.record.start}:00".zfill(5)
            self.record.left = 15
            Log.new(tid, f"0 times left, next time={self.record.time}")
        except PostWasRemovedOrCookiesError:
            next_time = (now + timedelta(minutes=5)).strftime("%H:%M")
            self.record.cookies = ""
            self.record.count = 8

        if not next_time:
            try:
                interval = ((self.record.end - now.hour) * 60 - now.minute) / time_left
            except (ValueError, ZeroDivisionError):
                interval = 60
            self.record.interval = abs(interval)
            next_time = (now + timedelta(minutes=abs(interval))).strftime("%H:%M")

        self.record.time = next_time
        self.record.save()

    def __up(self):
        r = self.record
        r.count += 1
        args = self.get_args(r.tid)
        if not args:
            raise PostWasRemovedOrCookiesError
        args.update({
            "infloat": "yes",
            "handlekey": "k_refresh",
            "inajax": "1",
            "ajaxtarget": "fwin_content_k_refresh"
        })
        with self.session.get(self.BASE_URL, params=args) as res:
            data = res.text.replace("""<?xml version="1.0" encoding="gbk"?>""", "")
        data = etree.HTML(etree.fromstring(data))
        alert = data.xpath("//div[@class='alert_right']/text()")
        if not alert:
            raise ValueError("Error `alert` not exists")
        time_left = re.findall(r"\s(\d{1,2})\s", alert[0])
        if not time_left:
            raise ValueError("Error `time left` not exists")
        try:
            if int(time_left[0]) == 0:
                raise NoTimeLeftError
        except ValueError:
            raise ValueError("Error when parsing `time left` ")

    def get_args(self, tid):
        with self.session.get(f"{self.BASE_URL}?mod=viewthread&tid={tid}") as resp:
            html = etree.HTML(resp.text)
        href = html.xpath("//a[@id='k_refresh']/@href")
        if not href:
            return None
        url = self.BASE_URL + href[0].replace("forum.php", "")
        return parse.parse_qs(parse.urlsplit(url).query)

    def login(self):
        driver = webdriver.PhantomJS("/usr/local/bin/phantomjs")
        driver.get("http://yeeyi.com/forum/index.php?app=member&act=login")

        def _set(element_id: str, data: str):
            ele = driver.find_element_by_id(element_id)
            ele.clear()
            ele.send_keys(data)

        _set("telTxtLogin", self.record.username)
        _set("passShow", self.record.password)

        elem = driver.find_element_by_id("postBtn")
        elem.click()

        cookies = [f"{i.get('name')}={i.get('value')}" for i in driver.get_cookies()]
        cookies = ";".join(cookies)

        driver.close()

        self.record.cookies = cookies
