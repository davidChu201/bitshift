from setuptools import setup, find_packages

setup(
    name = "bitshift",
    version = "0.1",
    packages = find_packages(),
    install_requires = ["Flask>=0.10.1", "pygments>=1.6"],
    author = "Benjamin Attal, Ben Kurtovic, Severyn Kozak",
    license = "MIT",
    url = "https://github.com/earwig/bitshift"
)
