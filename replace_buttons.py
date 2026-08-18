import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Replace solid backgrounds
    new_content = re.sub(r'\bbg-blue-600\b', 'bg-green', new_content)
    new_content = re.sub(r'\bbg-blue-500\b', 'bg-green', new_content)
    # Replace hover backgrounds
    new_content = re.sub(r'\bhover:bg-blue-700\b', 'hover:bg-green-dark', new_content)
    new_content = re.sub(r'\bhover:bg-blue-600\b', 'hover:bg-green-dark', new_content)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

def main():
    src_dir = 'src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.jsx') or file.endswith('.js'):
                replace_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
