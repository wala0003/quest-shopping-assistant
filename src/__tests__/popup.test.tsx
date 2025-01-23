import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Popup from "../popup"

describe("Popup Component", () => {
  it("renders without crashing", () => {
    render(<Popup />)
    // This is a basic test - we'll enhance it once we customize the popup
    expect(document.body).toBeInTheDocument()
  })
})