package store

var (
	DBNAME = "voice-chat"
	DBURI  = "mongodb://localhost:27017"
)

type Store struct {
	User UserStore
}
