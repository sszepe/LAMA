from lama.entities import make_entity_stats_csv


def main():
    data = make_entity_stats_csv()
    with open("reports/entities.csv", "w", encoding="utf-8") as f:
        f.write(data)


if __name__ == "__main__":
    main()
