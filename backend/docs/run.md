# How to run server

#### We are using this:

- `Go` 1.7
- `glide` for managing go package

#### 1. Install dependencies

```bash
brew install go glide
```

#### 2. Set up your go environment

`Go` needs own `global` project directory.

So create `new` directory for global `Go` project.

```bash
# example export GOPATH="~/Go"
export GOPATH="PATH for new global project"
```

#### 3. Clone repository:

```bash
git clone https://github.com/Flative/jude.git $GOPATH/src/jude
```

#### 4. Start server:

```bash
cd $GOPATH/src/jude/backend
go run *.go
```

#### 5. Open web browser

`http://127.0.0.1:5050`

