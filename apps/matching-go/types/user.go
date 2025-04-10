package types

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID             bson.ObjectID   `bson:"_id,omitempty" json:"_id,omitempty"`
	Name           string          `bson:"name" json:"name"`
	Email          string          `bson:"email" json:"email"`
	Password       string          `bson:"password,omitempty" json:"password,omitempty"`
	ProfilePicture string          `bson:"profilePicture,omitempty" json:"profilePicture,omitempty"`
	Bio            string          `bson:"bio,omitempty" json:"bio,omitempty"`
	Phone          string          `bson:"phone,omitempty" json:"phone,omitempty"`
	GoogleID       string          `bson:"googleId,omitempty" json:"googleId,omitempty"`
	Friends        []bson.ObjectID `bson:"friends,omitempty" json:"friends,omitempty"`
	BlockedUsers   []bson.ObjectID `bson:"blockedUsers,omitempty" json:"blockedUsers,omitempty"`
	Rating         int             `bson:"rating,omitempty" json:"rating,omitempty"`
	Status         string          `bson:"status,omitempty" json:"status,omitempty"`
	LastSeen       time.Time       `bson:"lastSeen" json:"lastSeen"`
	Device         struct {
		Platform string `bson:"platform,omitempty" json:"platform,omitempty"`
		Token    string `bson:"token,omitempty" json:"token,omitempty"`
	} `bson:"device" json:"device"`
	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}
