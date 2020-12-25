import { useEffect } from "react";
import { render } from "react-dom";

export default function Animation(props) {

    useEffect(() => {
        // Little Canvas things
        var canvas = document.querySelector("#canvas"),
            ctx = canvas.getContext('2d');

        // Set Canvas to be window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Configuration, Play with these
        var config = {
            particleNumber: 800,
            maxParticleSize: 10,
            maxSpeed: 40,
            colorVariation: 50
        };

        // Colors
        var colorPalette = {
            bg: { r: 12, g: 9, b: 29 },
            matter: [
                { r: 36, g: 18, b: 42 }, // darkPRPL
                { r: 78, g: 36, b: 42 }, // rockDust
                { r: 252, g: 178, b: 96 }, // solorFlare
                { r: 253, g: 238, b: 152 } // totesASun
            ]
        };

        // Some Variables hanging out
        var particles = [],
            centerX = canvas.width / 2,
            centerY = canvas.height / 2,
            drawBg,

            // Draws the background for the canvas, because space
            drawBg = function (ctx, color) {
                ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            };

        // Particle Constructor
        var Particle = function (x, y) {
            // X Coordinate
            this.x = x || Math.round(Math.random() * canvas.width);
            // Y Coordinate
            this.y = y || Math.round(Math.random() * canvas.height);
            // Radius of the space dust
            this.r = Math.ceil(Math.random() * config.maxParticleSize);
            // Color of the rock, given some randomness
            this.c = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)], true);
            // Speed of which the rock travels
            this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
            // Direction the Rock flies
            this.d = Math.round(Math.random() * 360);
        };

        // Provides some nice color variation
        // Accepts an rgba object
        // returns a modified rgba object or a rgba string if true is passed in for argument 2
        var colorVariation = function (color, returnString) {
            var r, g, b, a, variation;
            r = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.r);
            g = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.g);
            b = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation / 2)) + color.b);
            a = Math.random() + .5;
            if (returnString) {
                return "rgba(" + r + "," + g + "," + b + "," + a + ")";
            } else {
                return { r, g, b, a };
            }
        };

        // Used to find the rocks next point in space, accounting for speed and direction
        var updateParticleModel = function (p) {
            var a = 180 - (p.d + 90); // find the 3rd angle
            p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) : p.x -= p.s * Math.sin(p.d) / Math.sin(p.s);
            p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p.s);
            return p;
        };

        // Just the function that physically draws the particles
        // Physically? sure why not, physically.
        var drawParticle = function (x, y, r, c) {
            ctx.beginPath();
            ctx.fillStyle = c;
            ctx.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        };

        // Remove particles that aren't on the canvas
        var cleanUpArray = function () {
            particles = particles.filter((p) => {
                return (p.x > -100 && p.y > -100);
            });
        };


        var initParticles = function (numParticles, x, y) {
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(x, y));
            }
            particles.forEach((p) => {
                drawParticle(p.x, p.y, p.r, p.c);
            });
        };

        // That thing
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();


        // Our Frame function
        var frame = function () {
            // Draw background first
            drawBg(ctx, colorPalette.bg);
            // Update Particle models to new position
            particles.map((p) => {
                return updateParticleModel(p);
            });
            // Draw em'
            particles.forEach((p) => {
                drawParticle(p.x, p.y, p.r, p.c);
            });
            // Play the same song? Ok!
            window.requestAnimFrame(frame);
        };

        // Click listener
        document.body.addEventListener("click", function (event) {
            var x = event.clientX,
                y = event.clientY;
            cleanUpArray();
            initParticles(config.particleNumber, x, y);
        });

        // First Frame
        frame();

        // First particle explosion
        initParticles(config.particleNumber);
    })

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="z-10 w-full absolute inset-0 flex justify-end">
                    <span onClick={props.close} className="text-white text-sm flex items-center justify-center m-4 w-12 h-12 text-center rounded-full p-2 border-2 border-gray-200 cursor-pointer">Close</span>
                </div>
                <div className="inline-block align-bottom bg-transparent text-left overflow-hidden transform transition-all sm:align-middle w-screen h-screen" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <canvas id="canvas"></canvas>
                    <h1 className="text-3xl grid text-center space-y-2">
                        <span className="text-7xl">Merry Christmas!</span>
                        <span>***</span>
                        <span>Click Anywhere</span>
                    </h1>
                </div>
            </div>
        </div>
    )

}