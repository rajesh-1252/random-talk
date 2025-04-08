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
	IsGroup      bool            `bson:"isGroup,omitempty" json:"isGroup,omitempty"`
	GroupName    string          `bson:"groupName,omitempty" json:"groupName,omitempty"`
	GroupAvatar  string          `bson:"groupAvatar,omitempty" json:"groupAvatar,omitempty"`
	LastMessage  *LastMessage    `bson:"lastMessage,omitempty" json:"lastMessage,omitempty"`
	UnreadCount  map[string]int  `bson:"unreadCount,omitempty" json:"unreadCount,omitempty"`
	IsPinned     map[string]bool `bson:"isPinned,omitempty" json:"isPinned,omitempty"`
	IsMuted      map[string]bool `bson:"isMuted,omitempty" json:"isMuted,omitempty"`
	Archived     map[string]bool `bson:"archived,omitempty" json:"archived,omitempty"`
	DeletedFor   []bson.ObjectID `bson:"deletedFor,omitempty" json:"deletedFor,omitempty"`
	TypingUsers  []bson.ObjectID `bson:"typingUsers,omitempty" json:"typingUsers,omitempty"`
	ContactName  string          `bson:"contactName,omitempty" json:"contactName,omitempty"`
	CreatedAt    time.Time       `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time       `bson:"updatedAt" json:"updatedAt"`
}
