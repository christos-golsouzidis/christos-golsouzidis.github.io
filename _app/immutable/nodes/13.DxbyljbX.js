import{t as m,a,b as u}from"../chunks/Dd-x_IY3.js";import"../chunks/C-d1__QL.js";import{B as b,f as n,s as c,r,D as x}from"../chunks/Dc7-7dTI.js";import{N as k}from"../chunks/Zrdkj3zr.js";import{e as q,s as T}from"../chunks/DNOuTVi4.js";import{s as L}from"../chunks/A1dRbtGm.js";import{p as A}from"../chunks/DoaUHbN0.js";var S=m(`<section class=" my-6"><div class="flex justify-between font-bold bg-[rgb(151,151,185)] border-2
  px-2 py-1 pe-1 border-white rounded-t-md"><h2> </h2> <button class="text-xs clickable px-3 border-2 rounded-md">copy</button></div> <div class="text-sm overflow-x-auto bg-[rgb(201,201,250)]
  border-2 border-t-0 p-2 border-white rounded-b-md"><code><pre class="whitespace-pre text-blue-950"><!></pre></code></div></section>`);function g(i,e){let t=A(e,"title",8,"code");var o=S(),s=n(o),d=n(s),l=n(d,!0);r(d);var w=c(d,2);r(s);var _=c(s,2),f=n(_),h=n(f),v=n(h);L(v,e,"default",{},p=>{var y=u(`
# This is a code snippet
      `);a(p,y)}),r(h),r(f),r(_),r(o),b(()=>T(l,t())),q("click",w,()=>{const p=document.querySelector("code");p&&navigator.clipboard.writeText(p.innerText)}),a(i,o)}var P=m(`<main><h1 class="svelte-176fu2v">Widiscover</h1> <h2 class="svelte-176fu2v">Description</h2> <p class="svelte-176fu2v">Widiscover is a LLM-powered full stack solution for answering questions from
    articles on Wikipedia.</p> <h2 class="svelte-176fu2v">Characteristics</h2> <p class="svelte-176fu2v">The solution uses two LLMs: one for the retrieval part of searching for the
    relevant documents and another for extracting the answer. It is designed to
    be fast and efficient and also to run on machines without the need of any
    GPU.</p> <h3 class="svelte-176fu2v">See the code below</h3> <!> <h2 class="svelte-176fu2v">Back-end implementation</h2> <p class="svelte-176fu2v">Below is the back-end solution where the user can interact with the server and the LLMs consequently:</p> <!></main>`);function $(i){var e=P(),t=c(n(e),12);g(t,{title:"Python",children:(s,d)=>{x();var l=u(`### version = 2.3

import re
import requests
import numpy as np
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch



def extract_keywords(text: str):
    '''
    Extracts a list of words from a given string excluding stopwords.
    '''

    keywords = text.strip('.?,').split(' ')
    # remove stopwords
    with open('english', 'r') as fr:
        stopwords = fr.read().splitlines()
    keywords = [keyword for keyword in keywords if keyword not in stopwords]
    
    return keywords


def extract_text(url):
    '''
    Extracts a list of non-empty paragraphs from a given URL.
    '''

    doc = wikiscrap(url, 'p')
    doc = [re.sub(r'\\n|\\[\\d+\\]','', para) for para in doc] # clean text from [X] or \\n
    doc = [para for para in doc if para] # removes empty elements
    return doc


def wikisearch(search_keywords, result_number_per_page = 3, language_code='en'):
    '''
    Searches over the wikipedia API for topics related to the keywords and returns the results in URL form.
    '''

    if type(search_keywords) == list:
        search_keywords = ' '.join(search_keywords)

    base_url = 'https://api.wikimedia.org/core/v1/wikipedia/'
    endpoint = '/search/page'
    url = base_url + language_code + endpoint

    parameters = {'q': search_keywords, 'limit': result_number_per_page}

    headers = {"User_Agent": "any"}

    response = requests.get(url, headers=headers, params=parameters)

    article_urls = []

    for page in response.json()['pages']:
        if page['description'] != 'Topics referred to by the same term':
            article_urls.append('https://en.wikipedia.org/wiki/' + page['key'])

    return article_urls


def wikiscrap(url, element):
    '''
    Extracts the text of the paragraphs of a URL.
    '''

    response = requests.get(url)
    if not response.ok:
        print(response.status_code)
        return

    scraper = BeautifulSoup(response.text, 'html.parser')
    paragraphs = scraper.find_all(element)

    return [paragraph.get_text() for paragraph in paragraphs]


def get_similarity(text1,text2):
    '''
    Calculates the similarity of two sentences through embeddings.
    '''

    emb1 = sim_model.encode(text1,normalize_embeddings=True)
    emb2 = sim_model.encode(text2,normalize_embeddings=True)

    return emb1 @ emb2.T


def answer_query(query: str, content='', num_search_docs=3,
                qa_threshold = 0.70, sim_threshold = 0.55):
    '''
    Generates an answer regarding the given query. 
    Returns a dictionary with keys: answer, confidence score and source of the answer.
    '''

    keywords = extract_keywords(query)
    urls = wikisearch(keywords)

    # extract text from the paragraphs
    docs = [wikiscrap(url, 'p') for url in urls]
    docs = [[x for x in doc if x.strip()] for doc in docs]

    # get one list for all paragraphs
    flat_docs = [x for doc in docs for x in doc]

    # get one list for the index of the url
    url_idx = [idx for idx, doc in enumerate(docs) for _ in doc]

    # create a generator expression to extract relevant documents
    gen_similar = ((get_similarity(query,x),idx) for idx, x in enumerate(flat_docs))

    top_qa_score = 0.2
    top_idx = None
    results = []

    while True:
        try:
            sim_score, idx = next(gen_similar)
            if sim_score < sim_threshold:
                continue
            inputs = qa_tokenizer(query, flat_docs[idx], return_tensors='pt')
            outputs = qa_model(**inputs)
            with torch.no_grad():
                st = torch.nn.functional.softmax(outputs.start_logits, dim=1)
                end = torch.nn.functional.softmax(outputs.end_logits, dim=1)
                start_scores, start_idx = torch.max(st[0], dim=0)
                end_scores, end_idx = torch.max(end[0], dim=0)
                confidence = torch.sqrt(start_scores * end_scores)
            if start_idx != end_idx:
                if confidence > top_qa_score:
                    top_qa_score = confidence
                    top_idx = idx
                    results = inputs.input_ids[0][start_idx:end_idx+1]
                if confidence > qa_threshold:
                    break
        except:
            break
        
    top_answer = qa_tokenizer.decode(results, skip_special_tokens=True)

    return {'answer':top_answer,
            'score':top_qa_score,
            'source':urls[url_idx[top_idx]]
            }
    


def load_models(sim_model_str, qa_model_str):
    '''
    Loads the model and stores then to global variables. Returns None
    '''

    global sim_model
    global qa_model
    global qa_tokenizer

    sim_model = SentenceTransformer(sim_model_str)
    qa_model = AutoModelForQuestionAnswering.from_pretrained(qa_model_str)
    qa_tokenizer = AutoTokenizer.from_pretrained(qa_model_str)



def extract_topic(text):

    match = re.search(r'\\[(.*?)\\]', text)
    if match:
        return match.group(1)
    else:
        return None


def main():
    '''
    This is the CLI version of the app.

    '''

    global sim_model
    global qa_model
    global qa_tokenizer
    
    print('Widiscover v2.3 (CLI version)')
    print('Please wait while the models are loading...\\n')
    load_models('sentence-transformers/all-roberta-large-v1', 'deepset/roberta-large-squad2')
    print('Ask me anything...\\n')

    while True:
        query = input('Question: ')
        if query == 'exit' or query == 'quit':
            print('Bye!')
            break
        if query == '' or query == 'help':
            print('commands: exit / quit, help')
            continue
        
        data = answer_query(query, extract_topic(query))

        print('Answer: {}\\nComfidence: {}\\nSource: {}'.format(data['answer'], data['score'], data['source']))
        print()
    pass


if __name__ == "__main__":
    main()`);a(s,l)},$$slots:{default:!0}});var o=c(t,6);g(o,{title:"Python",children:(s,d)=>{x();var l=u(`import multiprocessing
import wicore23
from flask import Flask, jsonify, render_template, request, url_for, redirect


app = Flask(__name__)

def load_backend():

    print("backend loaded : {}".format(backend_loaded))
    wicore23.load_models('sentence-transformers/all-roberta-large-v1', 'deepset/roberta-large-squad2')
    backend_loaded = True
    print("backend loaded : {}".format(backend_loaded))


def make_rag():

    data = request.get_json()
    if not data:
        return jsonify({"answer": "Invalid request data"}), 400

    query = data.get('query', '')
    if not query:
        return jsonify({"answer": "No query provided"}), 400

    try:
        response = wicore23.answer_query(query)
        return response
    except Exception as e:
        print(f"Error processing query: {e}")
        return jsonify({"answer": "An error occurred while processing the query"}), 500


# Start the backend loading process when the module loads
backend_process = multiprocessing.Process(target=load_backend, daemon=True)
backend_process.start()

@app.route('/', methods=['GET', 'POST'])
def index():

    if request.method == 'POST':
        return make_rag()
    
    return render_template('index.html')

if __name__ == '__main__':
    host = 'localhost' # '0.0.0.0'
    port = '7454'
    uri = "{}:{}".format(host,port)
    print("listening on " + uri)
    app.run(host=host, port=port, debug=True, use_reloader=False)`);a(s,l)},$$slots:{default:!0}}),r(e),a(i,e)}var z=m('<main class="xl:mx-80 lg:mx-32 md:mx-16 mx-8"><!> <!></main>');function M(i){var e=z(),t=n(e);k(t);var o=c(t,2);$(o),r(e),a(i,e)}export{M as component};
