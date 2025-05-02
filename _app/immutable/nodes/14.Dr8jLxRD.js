import{b as z,d as W,t as k,a as v,e as B}from"../chunks/DfPuXkNp.js";import"../chunks/f2RD9YB3.js";import{b as M,h as S,f as C,a as U,c as j,ag as O,aj as G,ah as Q,W as D,af as H,d as X,F as Y,p as l,t as e,s as c,v as x,w as E,x as P,as as y,at as R,o as J}from"../chunks/DQbXhkys.js";import{N as K}from"../chunks/CtN36O20.js";import{e as V,s as Z}from"../chunks/RLEiTnsx.js";import{s as ee}from"../chunks/CksFBntw.js";import{b as $}from"../chunks/SMZJvKH5.js";import{p as oe}from"../chunks/DQ7xmQi6.js";function a(u,s,d,i,t){var f=u,r="",n;M(()=>{if(r===(r=s()??"")){S&&C();return}n!==void 0&&(X(n),n=void 0),r!==""&&(n=U(()=>{if(S){j.data;for(var o=C(),_=o;o!==null&&(o.nodeType!==8||o.data!=="");)_=o,o=O(o);if(o===null)throw G(),Q;z(j,_),f=D(o);return}var m=r+"",p=W(m);z(H(p),p.lastChild),f.before(p)}))})}var ae=k(`<section class="my-6"><div class="flex justify-between font-bold bg-[rgb(151,151,185)] border-2
  px-2 py-1 pe-1 border-white rounded-t-md"><h2 class="svelte-1rk07ky"> </h2> <button class="text-xs clickable px-3 border-2 rounded-md">copy</button></div> <div class="text-sm overflow-x-auto bg-[rgb(221,221,250)]
  border-2 border-t-0 p-2 border-white rounded-b-md"><code><pre class="whitespace-pre text-blue-950"><!>
</pre></code></div></section>`);function F(u,s){let d=oe(s,"title",8,"code"),i=E(),t=E();function f(){x(i)&&(navigator.clipboard.writeText(x(i).innerText),R(t,x(t).textContent="copied!"),setTimeout(()=>{R(t,x(t).textContent="copy")},2e3))}var r=ae(),n=l(r),o=l(n),_=l(o,!0);c(o);var m=e(o,2);$(m,g=>P(t,g),()=>x(t)),c(n);var p=e(n,2),h=l(p),b=l(h),w=l(b);ee(w,s,"default",{},null),y(),c(b),c(h),$(h,g=>P(i,g),()=>x(i)),c(p),c(r),Y(()=>Z(_,d())),V("click",m,f),v(u,r)}var re=k(`### version = 2.3

import re
import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch


def extract_keywords(text: str):
    &apos;&apos;&apos;
    Extracts a list of words from a given string excluding stopwords.
    &apos;&apos;&apos;

    keywords = text.strip(&apos;.?,&apos;).split(&apos; &apos;)
    # remove stopwords
    with open(&apos;english&apos;, &apos;r&apos;) as fr:
        stopwords = fr.read().splitlines()
    keywords = [keyword for keyword in keywords if keyword not in stopwords]
    
    return keywords


def extract_text(url):
    &apos;&apos;&apos;
    Extracts a list of non-empty paragraphs from a given URL.
    &apos;&apos;&apos;

    doc = wikiscrap(url, &apos;p&apos;)
    doc = [re.sub(r&apos;<!>n|<!>[<!>d+<!>]&apos;,&apos;&apos;, para) for para in doc] # clean text from [X] or <!>n
    doc = [para for para in doc if para] # removes empty elements
    return doc


def wikisearch(search_keywords, result_number_per_page = 3, language_code=&apos;en&apos;):
    &apos;&apos;&apos;
    Searches over the wikipedia API for topics related to the keywords and returns the results in URL form.
    &apos;&apos;&apos;

    if type(search_keywords) == list:
        search_keywords = &apos; &apos;.join(search_keywords)

    base_url = &apos;https://api.wikimedia.org/core/v1/wikipedia/&apos;
    endpoint = &apos;/search/page&apos;
    url = base_url + language_code + endpoint

    parameters = &#x7b;&apos;q&apos;: search_keywords, &apos;limit&apos;: result_number_per_page&#x7d;

    headers = &#x7b;&quot;User_Agent&quot;: &quot;any&quot;&#x7d;

    response = requests.get(url, headers=headers, params=parameters)

    article_urls = []

    for page in response.json()[&apos;pages&apos;]:
        if page[&apos;description&apos;] != &apos;Topics referred to by the same term&apos;:
            article_urls.append(&apos;https://en.wikipedia.org/wiki/&apos; + page[&apos;key&apos;])

    return article_urls


def wikiscrap(url, element):
    &apos;&apos;&apos;
    Extracts the text of the paragraphs of a URL.
    &apos;&apos;&apos;

    response = requests.get(url)
    if not response.ok:
        print(response.status_code)
        return

    scraper = BeautifulSoup(response.text, &apos;html.parser&apos;)
    paragraphs = scraper.find_all(element)

    return [paragraph.get_text() for paragraph in paragraphs]


def get_similarity(text1,text2):
    &apos;&apos;&apos;
    Calculates the similarity of two sentences through embeddings.
    &apos;&apos;&apos;

    global sim_model

    emb1 = sim_model.encode(text1,normalize_embeddings=True)
    emb2 = sim_model.encode(text2,normalize_embeddings=True)

    return emb1 @ emb2.T


def answer_query(query: str, content=&apos;&apos;, num_search_docs=1,
                qa_threshold = 0.90, sim_threshold = 0.65):
    &apos;&apos;&apos;
    Generates an answer regarding the given query. 
    Returns a dictionary with keys: answer, confidence score and source of the answer.
    &apos;&apos;&apos;
    
    global qa_model
    global qa_tokenizer

    keywords = extract_keywords(query)
    urls = wikisearch(keywords)

    # extract text from the paragraphs
    docs = [wikiscrap(url, &apos;p&apos;) for url in urls]
    docs = [[x for x in doc if x.strip()] for doc in docs]

    # get one list for all paragraphs
    flat_docs = [re.sub(r&apos;<!>[.*?<!>]&apos;, &apos;&apos;, x) for doc in docs for x in doc]

    # get one list for the index of the url
    url_idx = [idx for idx, doc in enumerate(docs) for _ in doc]

    # create a generator expression to extract relevant documents
    gen_similar = ((get_similarity(query,x),idx) for idx, x in enumerate(flat_docs))

    top_qa_score = 0.2
    top_idx = None
    results = None

    while True:
        try:
            sim_score, idx = next(gen_similar)
            if sim_score &lt; sim_threshold:
                continue
            inputs = qa_tokenizer(query, flat_docs[idx], return_tensors=&apos;pt&apos;)
            outputs = qa_model(**inputs)
            with torch.no_grad():
                st = torch.nn.functional.softmax(outputs.start_logits, dim=1)
                end = torch.nn.functional.softmax(outputs.end_logits, dim=1)
                start_scores, start_idx = torch.max(st[0], dim=0)
                end_scores, end_idx = torch.max(end[0], dim=0)
                confidence = torch.sqrt(start_scores * end_scores).item()
            if start_idx != end_idx:
                if confidence &gt; top_qa_score:
                    top_qa_score = confidence
                    top_idx = idx
                    results = inputs.input_ids[0][start_idx:end_idx+1]
                if confidence &gt; qa_threshold:
                    break
        except:
            break
        
    if results == None:
        return &#x7b;&apos;answer&apos;:&apos;Sorry, I couldn<!>&apos;t find anything on Wikipedia<!>&apos;s articles relevalt to the query.&apos;,
            &apos;score&apos;:0.0,&#x7d;
    top_answer = qa_tokenizer.decode(results, skip_special_tokens=True)
    return &#x7b;&apos;answer&apos;:top_answer,
            &apos;score&apos;:top_qa_score,
            &apos;source&apos;:urls[url_idx[top_idx]]
            &#x7d;
    


def load_models(sim_model_str, qa_model_str):
    &apos;&apos;&apos;
    Loads the model and stores then to global variables. Returns None
    &apos;&apos;&apos;

    global sim_model
    global qa_model
    global qa_tokenizer

    sim_model = SentenceTransformer(sim_model_str)
    qa_model = AutoModelForQuestionAnswering.from_pretrained(qa_model_str)
    qa_tokenizer = AutoTokenizer.from_pretrained(qa_model_str)



def extract_topic(text):

    match = re.search(r&apos;<!>[(.*?)<!>]&apos;, text)
    if match:
        return match.group(1)
    else:
        return None


def main():
    &apos;&apos;&apos;
    This is the CLI version of the app.

    &apos;&apos;&apos;

    global sim_model
    global qa_model
    global qa_tokenizer
    
    print(&apos;Widiscover v2.3 (CLI version)&apos;)
    print(&apos;Please wait while the models are loading...<!>n&apos;)
    load_models(&apos;sentence-transformers/all-roberta-large-v1&apos;, &apos;deepset/roberta-large-squad2&apos;)
    print(&apos;Ask me anything...<!>n&apos;)

    while True:
        query = input(&apos;Question: &apos;)
        if query == &apos;exit&apos; or query == &apos;quit&apos;:
            print(&apos;Bye!&apos;)
            break
        if query == &apos;&apos; or query == &apos;help&apos;:
            print(&apos;commands: exit / quit, help&apos;)
            continue
        
        data = answer_query(query, extract_topic(query))

        print(&apos;Answer: &#x7b;&#x7d;<!>nComfidence: &#x7b;&#x7d;<!>nSource: &#x7b;&#x7d;&apos;.format(data[&apos;answer&apos;], data[&apos;score&apos;], data[&apos;source&apos;]))
        print()
    pass


if __name__ == &quot;__main__&quot;:
    main()`,1),se=k(`<main class="portfolio"><h1>Widiscover</h1> <h2>Description</h2> <p>Widiscover is a LLM-powered full stack solution for answering questions from
    articles on Wikipedia.</p> <h2>Characteristics</h2> <p>The solution uses two LLMs: one for the retrieval part of searching for the
    relevant documents and another for extracting the answer. It is designed to
    be fast and efficient and also to run on machines without the need of any
    GPU.</p> <h3>See the code below</h3> <!> <h2>Back-end implementation</h2> <p>Below is the back-end solution where the user can interact with the server and the LLMs consequently:</p> <!></main>`);function te(u){var s=se(),d=e(l(s),12);F(d,{title:"Python",children:(t,f)=>{y();var r=re(),n=e(J(r));a(n,()=>"\\");var o=e(n,2);a(o,()=>"\\");var _=e(o,2);a(_,()=>"\\");var m=e(_,2);a(m,()=>"\\");var p=e(m,2);a(p,()=>"\\");var h=e(p,2);a(h,()=>"\\");var b=e(h,2);a(b,()=>"\\");var w=e(b,2);a(w,()=>"\\");var g=e(w,2);a(g,()=>"\\");var q=e(g,2);a(q,()=>"\\");var T=e(q,2);a(T,()=>"\\");var A=e(T,2);a(A,()=>"\\");var L=e(A,2);a(L,()=>"\\");var N=e(L,2);a(N,()=>"\\");var I=e(N,2);a(I,()=>"\\"),y(),v(t,r)},$$slots:{default:!0}});var i=e(d,6);F(i,{title:"Python",children:(t,f)=>{y();var r=B(`import threading
import wicore23
from flask import Flask, jsonify, render_template, request, url_for, redirect


app = Flask(__name__)
backend_loaded = False

sim_model = None
qa_model = None
qa_tokenizer = None

def load_backend():
    global backend_loaded

    print("backend loaded : {}".format(backend_loaded))
    wicore23.load_models('sentence-transformers/all-mpnet-base-v2', 'deepset/roberta-large-squad2')
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


@app.route('/', methods=['GET', 'POST'])
def index():

    if request.method == 'POST':
        return make_rag()
    
    return render_template('index.html')


if __name__ == '__main__':

    # Start the backend thread when the module loads
    loading_thread = threading.Thread(target=load_backend)
    loading_thread.start()
    host = 'localhost' # '0.0.0.0'
    port = '7454'
    uri = "{}:{}".format(host,port)
    print("listening on " + uri)
    app.run(host=host, port=port, debug=True, use_reloader=False)`);v(t,r)},$$slots:{default:!0}}),c(s),v(u,s)}var ne=k('<main class="xl:mx-80 lg:mx-32 md:mx-16 mx-8"><!> <!></main>');function fe(u){var s=ne(),d=l(s);K(d);var i=e(d,2);te(i),c(s),v(u,s)}export{fe as component};
