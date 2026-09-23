import zipfile,re,sys

def text(p):
    xml=zipfile.ZipFile(p).read("word/document.xml").decode("utf-8")
    t=re.sub(r"<[^>]+>","",re.sub(r"</w:p>","\n",xml))
    return t.replace("&apos;","'").replace("&quot;",'"').replace("&amp;","&")

def count_syllables(word):
    word=word.lower()
    word=re.sub(r"[^a-z]","",word)
    if not word: return 0
    if len(word)<=3: return 1
    word=re.sub(r"(es|ed|e)$","",word)
    groups=re.findall(r"[aeiouy]+",word)
    n=len(groups)
    return max(1,n)

def flesch_kincaid_grade(t):
    sentences=[s for s in re.split(r"[.!?]+",t) if s.strip()]
    words=re.findall(r"[A-Za-z']+",t)
    n_sent=max(1,len(sentences))
    n_words=max(1,len(words))
    n_syll=sum(count_syllables(w) for w in words)
    grade=0.39*(n_words/n_sent)+11.8*(n_syll/n_words)-15.59
    ease=206.835-1.015*(n_words/n_sent)-84.6*(n_syll/n_words)
    return grade,ease,n_words,n_sent

for p in sys.argv[1:]:
    t=text(p)
    g,e,w,s=flesch_kincaid_grade(t)
    print(f"{p}: grade={g:.1f}  ease={e:.1f}  words={w}  sentences={s}")
