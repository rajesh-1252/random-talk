package types

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID             bson.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Name           string          `bson:"name"`
	Email          string          `bson:"email"`
	Password       string          `bson:"password,omitempty"`
	ProfilePicture string          `bson:"profilePicture,omitempty"`
	Bio            string          `bson:"bio,omitempty"`
	Phone          string          `bson:"phone,omitempty"`
	GoogleID       string          `bson:"googleId,omitempty"`
	Friends        []bson.ObjectID `bson:"friends,omitempty"`
	BlockedUsers   []bson.ObjectID `bson:"blockedUsers,omitempty"`
	Rating         int             `bson:"rating,omitempty"`
	Status         string          `bson:"status,omitempty"`
	LastSeen       time.Time       `bson:"lastSeen,omitempty"`
	Device         struct {
		Platform string `bson:"platform,omitempty"`
		Token    string `bson:"token,omitempty"`
	} `bson:"device,omitempty"`
	CreatedAt time.Time `bson:"createdAt,omitempty"`
	UpdatedAt time.Time `bson:"updatedAt,omitempty"`
}
