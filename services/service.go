package services

import (
	"context"
)

type service struct {
	Ctx context.Context
}

type Option func(*service) error

func CustomConfigFileOption() Option {
	return func(sv *service) error {
		sv.Ctx = context.Background()
		return nil
	}
}

func New(options ...Option) (*service, error) {
	sv := &service{}

	for _, opt := range options {
		if err := opt(sv); err != nil {
			return nil, err
		}
	}

	return sv, nil
}
