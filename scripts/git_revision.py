import subprocess


class GitError(Exception):
    pass


def main():
    p = subprocess.run(
        [
            "git",
            "describe",
            "--always",
        ],
        encoding="utf-8",
        capture_output=True,
    )
    if p.returncode == 0:
        revision_hash = p.stdout
        with open("git_revision.txt", "w") as f:
            f.write(revision_hash)
    else:
        raise GitError(p.stderr)


if __name__ == "__main__":
    main()
