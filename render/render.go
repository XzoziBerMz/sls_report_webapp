package render

import "github.com/gofiber/fiber/v2"

func Render(page string, value fiber.Map, c *fiber.Ctx) error {
	value["csrf_token"] = c.Cookies("csrf_")
	return c.Render(page, value)
}

func AdsPage(c *fiber.Ctx) error {

	return Render("page-ads/index", fiber.Map{
		"title": "auth",
	}, c)
}

func ChatPage(c *fiber.Ctx) error {

	return Render("page-chat/index", fiber.Map{
		"title": "auth",
	}, c)
}

func LoginPage(c *fiber.Ctx) error {

	return Render("page-login/index", fiber.Map{
		"title": "auth",
	}, c)
}

func ImportVideoPage(c *fiber.Ctx) error {

	return Render("page-video/index", fiber.Map{
		"title": "auth",
	}, c)
}