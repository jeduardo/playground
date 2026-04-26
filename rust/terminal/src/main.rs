use farben::prelude::*;

fn main() {
    style!("error", "[bold bg:red fg:white]");
    style!("warn", "[bold yellow]");
    style!("info", "[bold cyan]");

    cprintln!("[error]error[/]: Something bad happened...");
    cprintln!("[warn]warn[/]: This looks suspicious.");
    cprintln!("[info]info[/]: Server started on port 8080.");
}
