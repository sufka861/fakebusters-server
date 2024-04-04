import pandas as pd
import sys
import json

def aggregate_and_sort_frequencies(file_path):
    df = pd.read_csv(file_path)
    aggregated_data = df.groupby('element')['frequency_in_document'].sum()
    sorted_data = aggregated_data.sort_values(ascending=False)

    top_50_data = sorted_data.head(50)

    result_dict = top_50_data.to_dict()
    result_json = json.dumps(result_dict, ensure_ascii=False, indent=4)

    return result_json

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]
    result_json = aggregate_and_sort_frequencies(file_path)
    print(result_json)