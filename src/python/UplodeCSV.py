import sys
import pandas as pd
import json

def combine_csv_files(file_paths, output_path):
    combined_df_list = []
    required_columns = {'author_username', 'text'}
    
    for file in file_paths:
        try:
            df = pd.read_csv(file)
            if not required_columns.issubset(df.columns):
                print(f"Error: The file {file} does not contain the required columns: {required_columns}")
                sys.exit(1)
            combined_df_list.append(df[['author_username', 'text']])
        except Exception as e:
            print(f"Error reading {file}: {e}")
            sys.exit(1)
    
    combined_df = pd.concat(combined_df_list, ignore_index=True)
    combined_df.to_csv(output_path, index=False)
    return combined_df

def analyze_posts_distribution(combined_df):
    posts_per_author = combined_df['author_username'].value_counts()
    
    bins = list(range(10, 160, 10)) + [float('inf')]
    labels = [f'{i}-{i+9}' for i in range(10, 150, 10)] + ['150+']
    posts_per_author_filtered = posts_per_author[posts_per_author >= 10]
    posts_per_author_binned = pd.cut(posts_per_author_filtered, bins=bins, labels=labels, right=False).value_counts().sort_index()
    posts_distribution_dict = posts_per_author_binned.to_dict()

    return posts_distribution_dict

def additional_analysis(combined_df):
    num_authors = combined_df['author_username'].nunique()
    words_per_author = combined_df.groupby('author_username')['text'].apply(lambda texts: sum(len(text.split()) for text in texts)).to_dict()

    return num_authors, words_per_author

if __name__ == "__main__":
    output_path = sys.argv[1]
    file_paths = sys.argv[2:]
    
    if not file_paths or not output_path:
        print("Usage: python UplodeCSV.py <output_file> <file1> <file2> ...")
        sys.exit(1)

    try:
        combined_df = combine_csv_files(file_paths, output_path)
        posts_distribution = analyze_posts_distribution(combined_df)
        num_authors, words_per_author = additional_analysis(combined_df)

        result = {
            "posts_distribution": posts_distribution,
            "num_authors": num_authors,
            "words_per_author": words_per_author
        }
        
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Failed to combine files: {str(e)}")
        sys.exit(1)
