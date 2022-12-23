import lama.eventstore as eventstore


def main():
    print(len(eventstore.get_events()))


if __name__ == "__main__":
    main()
