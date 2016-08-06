import click

from jude.app import app


@click.group()
def cli():
    pass


@cli.command()
def run():
    app.run()


if __name__ == '__main__':
    cli()
