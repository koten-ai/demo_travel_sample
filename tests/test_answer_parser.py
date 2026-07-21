from travel_planner.answer_parser import (
    parse_markdown_answer,
    structured_answer_to_results,
)

PARIS_HOTELS_ANSWER = (
    "**Nearest hotels to Paris airports (CDG / ORY)** "
    "Since the Zeus graph connection is currently unavailable, here are the top real-world "
    "options based on proximity and traveler data: "
    "### **Charles de Gaulle (CDG) – Terminal-area hotels** "
    "1. **Hôtel ibis Paris CDG Airport** "
    "- **Location**: Directly connected to Terminal 1 & 3 via covered walkway "
    "- **Description**: Budget-friendly 3-star with 24-hour shuttle, soundproof rooms, "
    "and quick access to all terminals. "
    "- **Image**: Typical modern airport-hotel exterior with blue ibis signage. "
    "2. **Hôtel Pullman Paris CDG Airport** "
    "- **Location**: 5-minute walk from Terminal 1 & 2 via pedestrian bridge "
    "- **Description**: Upscale 4-star with large rooms, fitness center, and excellent sound insulation. "
    "- **Image**: Sleek glass-and-steel building with airport views. "
    "3. **Novotel Paris Charles de Gaulle Airport** "
    "- **Location**: Adjacent to Terminal 3, 3-minute covered walk "
    "- **Description**: Family-friendly 4-star with indoor pool and direct RER access. "
    "- **Image**: Contemporary red-and-white façade. "
    "### **Orly (ORY) – Closest options** "
    "1. **Hôtel ibis Paris Orly Aéroport** "
    "- **Location**: 2-minute walk from Orly terminals via pedestrian link "
    "- **Description**: Reliable 3-star with free shuttle, late check-in, and good value. "
    "- **Image**: Standard ibis blue-and-white design. "
    "2. **Hôtel Hilton Paris Orly Airport** "
    "- **Location**: Directly connected to Orly terminals "
    "- **Description**: 4-star with modern rooms, fitness facilities, and 24-hour front desk. "
    "- **Image**: Glass-fronted building with airport branding. "
    "**Tip**: For the absolute closest stay, choose hotels with “Aéroport” or “Airport” in the name — "
    "they are typically within a 5-minute covered walk or free shuttle ride. "
    "Would you like me to refine this list (e.g., by star rating, price range, or specific terminal) "
    "once the Zeus connection is restored?"
)


def test_parse_paris_airport_hotels():
    data = parse_markdown_answer(PARIS_HOTELS_ANSWER)
    assert data is not None
    assert len(data["airports"]) == 2

    cdg = data["airports"][0]
    assert cdg["name"] == "Charles de Gaulle (CDG)"
    assert cdg["section"] == "Terminal-area hotels"
    assert len(cdg["hotels"]) == 3
    assert cdg["hotels"][0]["name"] == "Hôtel ibis Paris CDG Airport"
    assert "Terminal 1 & 3" in cdg["hotels"][0]["location"]
    assert "Budget-friendly" in cdg["hotels"][0]["description"]
    assert "ibis signage" in cdg["hotels"][0]["image"]

    ory = data["airports"][1]
    assert ory["name"] == "Orly (ORY)"
    assert len(ory["hotels"]) == 2
    assert ory["hotels"][1]["name"] == "Hôtel Hilton Paris Orly Airport"

    assert "Aéroport" in data["tip"]
    assert "Zeus graph connection" in data["context"]
    assert "Would you like me to refine" in data["follow_up"]


def test_parse_embedded_json_block():
    answer = (
        "Here are the results:\n"
        "```json\n"
        '{"airports": [{"name": "Test Airport", "hotels": [{"name": "Test Hotel"}]}]}\n'
        "```"
    )
    data = parse_markdown_answer(answer)
    assert data == {"airports": [{"name": "Test Airport", "hotels": [{"name": "Test Hotel"}]}]}


def test_parse_empty_or_unstructured():
    assert parse_markdown_answer(None) is None
    assert parse_markdown_answer("") is None
    assert parse_markdown_answer("Just a plain sentence with no structure.") is None


def test_structured_answer_to_results():
    data = parse_markdown_answer(PARIS_HOTELS_ANSWER)
    results = structured_answer_to_results(data)
    assert len(results) == 5
    assert results[0]["name"] == "Hôtel ibis Paris CDG Airport"
    assert results[0]["location"] == "Directly connected to Terminal 1 & 3 via covered walkway"
    assert results[4]["name"] == "Hôtel Hilton Paris Orly Airport"


TRAVEL_SAMPLE_PARIS_HOTELS = (
    "**Nearest hotels to Paris airports (CDG & Orly)** Here are real hotels in Paris "
    "that match your preference for proximity to the main Paris airports. "
    "### Top matching hotels: "
    "1. **Kube Hotel** "
    "- **Description**: Stylish and atmospheric, the Kube Hotel exudes a high tech decor. "
    "- **Price**: €190-2,500 "
    "- **Address**: 1-5 Passage Ruelle, Paris/18th arrondissement "
    "- **URL**: http://www.kubehotel-paris.com/en/page/kube-hotel-paris-18.1.html "
    "2. **Renaissance Paris Arc de Triomphe** "
    "- **Description**: Thoroughly modern property with floor-to-ceiling windows. "
    "- **Address**: Avenue de Wagram 39, Paris/17th arrondissement "
    "- **URL**: http://www.marriott.com/hotels/travel/parwg "
    "3. **Hôtel de Crillon** "
    "- **Description**: Legendary hotel overlooking Place de la Concorde. "
    "- **Address**: 10, place de la Concorde, Paris/8th arrondissement"
)


def test_parse_travel_sample_top_matching_hotels():
    """LLM often returns ### Top matching hotels with Address/Price/URL fields."""
    data = parse_markdown_answer(TRAVEL_SAMPLE_PARIS_HOTELS)
    assert data is not None
    assert "sections" in data
    assert data["sections"][0]["name"].startswith("Top matching hotels")
    assert len(data["sections"][0]["items"]) == 3
    assert data["sections"][0]["items"][0]["name"] == "Kube Hotel"
    assert data["sections"][0]["items"][0]["price"] == "€190-2,500"
    assert "Passage Ruelle" in data["sections"][0]["items"][0]["address"]

    results = structured_answer_to_results(data)
    assert len(results) == 3
    assert results[0]["name"] == "Kube Hotel"
    # Address maps to location; generic section title is not used as location.
    assert "Passage Ruelle" in results[0]["location"]
    assert results[0]["price"] == "€190-2,500"
    assert "kubehotel" in results[0]["url"]