import os
import sys
import re
import json
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import CountVectorizer

def remove_links_and_usernames(text):
    return re.sub(r'https?://\S+|@\w+|\d+', '', text)

def remove_stop_words(text, stop_words):
    words = word_tokenize(text)
    filtered_words = [word for word in words if word not in stop_words]
    return ' '.join(filtered_words)

def preprocess_text(text, stop_words, is_dropping_links):
    if is_dropping_links:
        text = remove_links_and_usernames(text)
    text = remove_stop_words(text, stop_words)
    return text

def process_and_analyze(file_paths, output_file_path, is_dropping_links, is_dropping_punctuation, vocabulary, word_threshold, account_threshold, top_value_words):
    try:
        stop_words = set(vocabulary)

        df = pd.concat([pd.read_csv(file) for file in file_paths])

        required_columns = {'author_username', 'text'}
        if not required_columns.issubset(df.columns):
            print("Error: One or more files do not contain the required columns.")
            sys.exit(1)

        initial_authors_count = df['author_username'].nunique()
        initial_posts_count = len(df)

        df_selected = df[['author_username', 'text']]
        posts_count_by_author = df_selected.groupby('author_username').size()
        authors_with_enough_posts = posts_count_by_author[posts_count_by_author > account_threshold].index.tolist()
        df_filtered = df_selected[df_selected['author_username'].isin(authors_with_enough_posts)]
        concatenated_texts_by_author = df_filtered.groupby('author_username')['text'].apply(' '.join)
        corpus = [preprocess_text(text, stop_words, is_dropping_links) for text in concatenated_texts_by_author]

        vectorizer = CountVectorizer()
        X = vectorizer.fit_transform(corpus)
        feature_names = vectorizer.get_feature_names_out()

        word_frequency_data = []
        for author_index, text_vector in enumerate(X.toarray()):
            author = concatenated_texts_by_author.index[author_index]
            word_counts = list(zip(feature_names, text_vector))
            if top_value_words:
                word_counts = sorted(word_counts, key=lambda x: x[1], reverse=True)[:word_threshold]
            for word, count in word_counts:
                if count > 0:
                    word_frequency_data.append((author, word, count))

        output_dir = os.path.dirname(output_file_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)

        word_frequency_df = pd.DataFrame(word_frequency_data, columns=['document', 'element', 'frequency_in_document'])
        word_frequency_df.to_csv(output_file_path, index=False, mode='w', header=True)

        aggregated_data = word_frequency_df.groupby('element')['frequency_in_document'].sum()
        sorted_data = aggregated_data.sort_values(ascending=False)
        top_30_data = sorted_data.head(30)

        categories = top_30_data.index.tolist()
        data = top_30_data.tolist()

        total_elements = len(aggregated_data)
        total_rows = len(word_frequency_df)
        total_documents = word_frequency_df['document'].nunique()

        result_dict = {
            'initial_authors_count': initial_authors_count,
            'initial_posts_count': initial_posts_count,
            'categories': categories,
            'data': data,
            'word': total_elements,
            'freq': total_rows,
            'account': total_documents,
            'project_id': output_file_path,
            'author_username': authors_with_enough_posts
        }

        result_json = json.dumps(result_dict, ensure_ascii=False, indent=4)
        return result_json
    except Exception as e:
        print(f"Error during processing: {e}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        output_file_path = sys.argv[2]
        file_paths = [sys.argv[1]]  # Single file path argument

        account_threshold = int(sys.argv[3])
        word_threshold = int(sys.argv[4])
        is_dropping_links = sys.argv[5].lower() == 'true'
        is_dropping_punctuation = sys.argv[6].lower() == 'true'
        showTblholdSettings = sys.argv[7].lower() == 'true'
        vocabulary_file_path = sys.argv[8]
        
        with open(vocabulary_file_path, 'r', encoding='utf-8') as file:
            vocabulary_json = json.load(file)
        
        vocabulary = [item['name'] for item in vocabulary_json]
        top_value_words = False  # As the boolean flag `top_value_words` was not provided

        result_json = process_and_analyze(file_paths, output_file_path, is_dropping_links, is_dropping_punctuation, vocabulary, word_threshold, account_threshold, top_value_words)
        print(result_json)
    except IndexError:
        print("Error: Missing required command-line arguments.")
        sys.exit(1)
    except ValueError as ve:
        print(f"Error: Invalid argument type - {ve}")
        sys.exit(1)
    except FileNotFoundError as fnfe:
        print(f"Error: File not found - {fnfe}")
        sys.exit(1)
