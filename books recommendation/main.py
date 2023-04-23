# Import Pandas
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

# Create a ChromeDriver instance
driver = webdriver.Chrome()

# Navigate to the Amazon.com homepage
driver.get("https://www.amazon.com")

# Find the search box element and enter a search query
search_box = driver.find_element_by_name("field-keywords")
search_box.send_keys("The Great Gatsby")
search_box.send_keys(Keys.RETURN)

# Load restaurant data
# book = pd.read_csv('Books.csv', low_memory=False)
# # Load rating data
# # Open a web browser and navigate to the Amazon site
# for book_title in book['Book-Title']:
#     print("d")