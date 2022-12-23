from setuptools import setup


setup(
    name="lama",
    packages=["lama"],
    version="0.1",
    install_requires=[
        "bottle==0.12.18",
        # "bottle-websocket==0.2.9",
        "lxml==4.6.2",
        "PyJWT==2.3.0",
        "pymongo==3.11.2",
        "rapidfuzz==0.14.2",
        "requests==2.25.1",
        "schema==0.7.4",
        "Unidecode==1.2.0",
    ],
)
