package handlers

import (
	"context"
	"fmt"

	"matching/store"
	"matching/types"
)

// how handler work
// 1 . get the store for the constructor function
type UserHandler struct {
	userStore store.UserStore
}

func NewUserHandler(userStore store.UserStore) *UserHandler {
	return &UserHandler{
		userStore: userStore,
	}
}

func (h *UserHandler) GetUserByID(userID string) (*types.User, error) {
	ctx := context.TODO()
	user, err := h.userStore.GetUserByID(ctx, userID)
	if err != nil {
		fmt.Println("Error fetching user")
		return nil, err
	}
	return user, nil
}
