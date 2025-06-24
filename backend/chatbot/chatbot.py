from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import sys
import json

sys.stderr.write("Python script started\n")

try:
    base_model = "google/mt5-small"
    adapter_path = "G:\\IV\\Pro\\shil\\backend\\chatbot\\chatbot"
    tokenizer = AutoTokenizer.from_pretrained(base_model)
    model = AutoModelForSeq2SeqLM.from_pretrained(base_model)
    from peft import PeftModel, PeftConfig
    model = PeftModel.from_pretrained(model, adapter_path)
    sys.stderr.write("Base model and adapter loaded\n")
except Exception as e:
    sys.stderr.write(f"MODEL LOAD ERROR: {str(e)}\n")
    exit(1)

dialogs = []
try:
    with open("g:\\IV\\Pro\\shil\\backend\\chatbot\\ukrainian_dialogs.jsonl", "r", encoding="utf-8") as f:
        for line in f:
            dialogs.append(json.loads(line))
    sys.stderr.write("Dialogs loaded\n")
except Exception as e:
    sys.stderr.write(f"DIALOGS LOAD ERROR: {str(e)}\n")
    exit(1)

def find_in_dialogs(question):
    for pair in dialogs:
        if pair["question"].strip().lower() == question.strip().lower():
            return pair["answer"]
    return None

def get_answer(question):
    answer = find_in_dialogs(question)
    if answer:
        return answer
    inputs = tokenizer(question, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=50)
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return answer

if __name__ == "__main__":
    for line in sys.stdin:
        line = line.strip()
        sys.stderr.write(f"RAW LINE: '{line}'\n")
        if not line:
            continue
        try:
            data = json.loads(line)
            question = data.get("question", "")
            sys.stderr.write(f"Received question: {question}\n")
            answer = get_answer(question)
            sys.stderr.write(f"Generated answer: {answer}\n")
            print(json.dumps({"answer": answer}), flush=True)
        except Exception as e:
            sys.stderr.write(f"ERROR: {str(e)}\n")
            print(json.dumps({"answer": "Вибачте, сталася помилка."}), flush=True)