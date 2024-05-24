import os
import sys
import re
import json
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import CountVectorizer


def preprocess_text(text, stop_words):
    text = re.sub(r'https?\S+|@\w+|\d+', '', text)
    words = word_tokenize(text)
    filtered_words = [word for word in words if word not in stop_words]
    return ' '.join(filtered_words)

def process_and_analyze(file_paths, output_file_name):
    script_dir = os.path.dirname(os.path.realpath(__file__))
    stopwords_file = os.path.join(script_dir, 'data/vocabularyDefault.txt')
    output_dir = os.path.join(script_dir, 'data')

    with open(stopwords_file, 'r', encoding='utf-8') as f:
        hebrew_stop_words = set(f.read().split())
    english_stop_words = set(stopwords.words('english'))
    stop_words = hebrew_stop_words.union(english_stop_words)

    df = pd.concat([pd.read_csv(file) for file in file_paths])

    required_columns = {'author_username', 'text'}
    if not required_columns.issubset(df.columns):
        print("Error: One or more files do not contain the required columns.")
        sys.exit(1)

    initial_authors_count = df['author_username'].nunique()
    initial_posts_count = len(df)

    df_selected = df[['author_username', 'text']]
    posts_count_by_author = df_selected.groupby('author_username').size()
    authors_with_enough_posts = posts_count_by_author[posts_count_by_author > 30].index.tolist()
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

    output_file_path = os.path.join(output_dir, output_file_name)
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
        'project_id': output_file_name,
        'author_username': authors_with_enough_posts
    }

    result_json = json.dumps(result_dict, ensure_ascii=False, indent=4)
    return result_json

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <output_file_name> <file_path1> <file_path2> ...")
        sys.exit(1)
    output_file_name = sys.argv[1]
    file_paths = sys.argv[2:]

    # # Download necessary NLTK resources
    # nltk.download('stopwords')
    # nltk.download('punkt')  # for word_tokenize
    
    analysis_results = process_and_analyze(file_paths, output_file_name)
    print(analysis_results)

