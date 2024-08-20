package services

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

func (sv *service) GetUser() (map[string]interface{}, error) {

	client := resty.New()
	res := map[string]interface{}{}
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetResult(&res). // or SetResult(AuthSuccess{}).
		Get("https://pokeapi.co/api/v2/pokemon/ditto")
	if err != nil {
		return res, err
	}
	fmt.Println(resp.Status())
	return res, nil

}
