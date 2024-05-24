import sys
import pandas as pd

def combine_csv_files(file_paths, output_path):
    combined_df_list = []
    required_columns = {'author_username', 'text'}
    
    for file in file_paths:
        df = pd.read_csv(file)
        if not required_columns.issubset(df.columns):
            print(f"Error: The file {file} does not contain the required columns: {required_columns}")
            sys.exit(1)
        combined_df_list.append(df[['author_username', 'text']])
    
    combined_df = pd.concat(combined_df_list)
    combined_df.to_csv(output_path, index=False)

if __name__ == "__main__":
    file_paths = sys.argv[2:]  # The file paths start from the third argument
    output_path = sys.argv[1]  # The second argument is the output path

    if not file_paths or not output_path:
        print("Usage: python combine_csv.py <output_file> <file1> <file2> ...")
        sys.exit(1)

    try:
        combine_csv_files(file_paths, output_path)
        print(f"Combined file saved to {output_path}")
    except Exception as e:
        print(f"Failed to combine files: {str(e)}")
        sys.exit(1)
