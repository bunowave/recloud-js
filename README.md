# @bunowaveltd/recloud

Privacy-first bot protection for JavaScript, Node.js, Next.js and React.

## Install

pip install RECLOUD_URL/packages/pypi/recloud-1.0.0.tar.gz



## Use

```python
from recloud import verify

result = verify(token, secret="YOUR_SECRET_KEY", remoteip=ip)

if not result:
    abort(400)
```

Documentation: https://recloud-turnstile.bunowave.shop/docs/sdks

License: MIT
