import sys
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import CountVectorizer
import os
import pandas as pd


# Get the directory where the script is located
script_dir = os.path.dirname(os.path.realpath(__file__))
stopwords_file = os.path.join(script_dir, 'data/hebrew_stop_words.txt')

# Define the output directory
output_dir = os.path.join(script_dir, 'data')

def preprocess_text(text, stop_words):
    text = re.sub(r'https?\S+|@\w+|\d+', '', text)
    words = word_tokenize(text)
    filtered_words = [word for word in words if word not in stop_words]
    return ' '.join(filtered_words)

def main(file_path):
    # Use the absolute path for opening the file
    with open(stopwords_file, 'r', encoding='utf-8') as f:
        hebrew_stop_words = set(f.read().split())

    english_stop_words = set(stopwords.words('english'))
    stop_words = hebrew_stop_words.union(english_stop_words)

    df = pd.read_csv(file_path)
    required_columns = {'author_username', 'text'}

    if not required_columns.issubset(df.columns):
        print(f"Error: The file {file_path} does not contain the required columns.")
        exit(1)

    df_selected = df[['author_username', 'text']]
    posts_count_by_author = df_selected.groupby('author_username').size()
    authors_with_enough_posts = posts_count_by_author[posts_count_by_author > 30].index
    df_filtered = df_selected[df_selected['author_username'].isin(authors_with_enough_posts)]
    concatenated_texts_by_author = df_filtered.groupby('author_username')['text'].apply(' '.join)
    corpus = [preprocess_text(text, stop_words) for text in concatenated_texts_by_author]

    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names_out()

    word_frequency_data = []
    for author_index, text_vector in enumerate(X.toarray()):
        author = concatenated_texts_by_author.index[author_index]
        for word_index, count in enumerate(text_vector):
            if count > 0:
                word = feature_names[word_index]
                word_frequency_data.append((author, word, count))

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_file_path = os.path.join(output_dir, os.path.basename(file_path).replace('.csv', '_frequency.csv'))
    word_frequency_df = pd.DataFrame(word_frequency_data, columns=['document', 'element', 'frequency_in_document'])
    word_frequency_df.to_csv(output_file_path, index=False, mode='w', header=True)

    print(f"CSV file '{output_file_path}' with the frequency of elements from all authors has been created successfully.")
    return output_file_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <file_path>")
        exit(1)

    output_file = main(sys.argv[1])
    print(output_file)  # This will be captured by Node.js
