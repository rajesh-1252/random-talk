package types

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type LastMessage struct {
	Sender    bson.ObjectID `bson:"sender,omitempty" json:"sender,omitempty"`
	Text      string        `bson:"text,omitempty" json:"text,omitempty"`
	Media     string        `bson:"media,omitempty" json:"media,omitempty"`
	Timestamp time.Time     `bson:"timestamp" json:"timestamp"`
}

type Conversation struct {
	ID           bson.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Participants []bson.ObjectID `bson:"participants" json:"participants"`
	IsGroup      bool            `bson:"isGroup" json:"isGroup"`
	GroupName    string          `bson:"groupName" json:"groupName"`
	GroupAvatar  string          `bson:"groupAvatar" json:"groupAvatar"`
	LastMessage  *LastMessage    `bson:"lastMessage" json:"lastMessage"`
	UnreadCount  map[string]int  `bson:"unreadCount" json:"unreadCount"`
	IsPinned     map[string]bool `bson:"isPinned" json:"isPinned"`
	IsMuted      map[string]bool `bson:"isMuted" json:"isMuted"`
	Archived     map[string]bool `bson:"archived" json:"archived"`
	DeletedFor   []bson.ObjectID `bson:"deletedFor" json:"deletedFor"`
	TypingUsers  []bson.ObjectID `bson:"typingUsers" json:"typingUsers"`
	ContactName  string          `bson:"contactName" json:"contactName"`
	CreatedAt    time.Time       `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time       `bson:"updatedAt" json:"updatedAt"`
}
