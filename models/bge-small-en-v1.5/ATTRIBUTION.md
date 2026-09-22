# Local search model

This directory contains the quantized ONNX conversion by Xenova of BAAI's BGE small English v1.5 embedding model. The upstream model card identifies its license as MIT. The accompanying LICENSE is the upstream FlagEmbedding MIT notice, retrieved September 8, 2026.

- Original model: https://huggingface.co/BAAI/bge-small-en-v1.5
- Conversion: https://huggingface.co/Xenova/bge-small-en-v1.5/tree/ea104dacec62c0de699686887e3f920caeb4f3e3
- Upstream license: https://github.com/FlagOpen/FlagEmbedding/blob/master/LICENSE
- Model and tokenizer integrity: manifest.json records the six pinned files and SHA-256 hashes.
- public-document-vectors.json is a derived projection of this application's eligible public program content, produced locally. It contains document vectors, not staff question vectors or staff records.

The model produces similarities for English retrieval. It does not generate ASK answers, establish source accuracy, or replace the current content-eligibility checks. Staff questions are not sent to Hugging Face.
