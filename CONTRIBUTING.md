# Contributing to Kontinua

First off, thank you for considering contributing to Kontinua! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork Kontinua and create a branch with a descriptive name.

## Get the test suite running

Make sure you're using Python >= 3.10 and have installed the development dependencies.

```bash
pip install -e ".[dev,benchmark]"
```

Now run the test suite using `pytest`:

```bash
pytest tests/
```

Make sure all tests pass before submitting your PR!

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Kontinua's master branch:

```bash
git remote add upstream git@github.com:kontinua/kontinua.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```bash
git checkout feature/my-feature
git rebase master
git push --set-upstream origin feature/my-feature
```

Finally, go to GitHub and make a Pull Request. Ensure that you fill out the provided PR template.

## License

By contributing to Kontinua, you agree that your contributions will be licensed under its Apache 2.0 License.
