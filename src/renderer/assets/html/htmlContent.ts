export function generateHtml(reportDivContent: string) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <style>
                html {
                  line-height: 1.15; /* 1 */
                  -webkit-text-size-adjust: 100%; /* 2 */
                }
                
                body {
                  margin: 0;
                }
                
                main {
                  display: block;
                }
                
                h1 {
                  font-size: 2em;
                  margin: 0.67em 0;
                }
                
                hr {
                  box-sizing: content-box; /* 1 */
                  height: 0; /* 1 */
                  overflow: visible; /* 2 */
                }
                
                pre {
                  font-family: monospace, monospace; /* 1 */
                  font-size: 1em; /* 2 */
                }
                
                a {
                  background-color: transparent;
                }
                
                abbr[title] {
                  border-bottom: none; /* 1 */
                  text-decoration: underline; /* 2 */
                  -webkit-text-decoration: underline dotted;
                          text-decoration: underline dotted; /* 2 */
                }
                
                b,
                strong {
                  font-weight: bolder;
                }
                
                code,
                kbd,
                samp {
                  font-family: monospace, monospace; /* 1 */
                  font-size: 1em; /* 2 */
                }
                
                small {
                  font-size: 80%;
                }
                
                sub,
                sup {
                  font-size: 75%;
                  line-height: 0;
                  position: relative;
                  vertical-align: baseline;
                }
                
                sub {
                  bottom: -0.25em;
                }
                
                sup {
                  top: -0.5em;
                }
                
                img {
                  border-style: none;
                }
                
                button,
                input,
                optgroup,
                select,
                textarea {
                  font-family: inherit; /* 1 */
                  font-size: 100%; /* 1 */
                  line-height: 1.15; /* 1 */
                  margin: 0; /* 2 */
                }
                
                button,
                input { /* 1 */
                  overflow: visible;
                }
                
                button,
                select { /* 1 */
                  text-transform: none;
                }
                
                button,
                [type="button"],
                [type="reset"],
                [type="submit"] {
                  -webkit-appearance: button;
                }
                
                button::-moz-focus-inner,
                [type="button"]::-moz-focus-inner,
                [type="reset"]::-moz-focus-inner,
                [type="submit"]::-moz-focus-inner {
                  border-style: none;
                  padding: 0;
                }
                
                button:-moz-focusring,
                [type="button"]:-moz-focusring,
                [type="reset"]:-moz-focusring,
                [type="submit"]:-moz-focusring {
                  outline: 1px dotted ButtonText;
                }
                
                fieldset {
                  padding: 0.35em 0.75em 0.625em;
                }
                
                legend {
                  box-sizing: border-box; /* 1 */
                  color: inherit; /* 2 */
                  display: table; /* 1 */
                  max-width: 100%; /* 1 */
                  padding: 0; /* 3 */
                  white-space: normal; /* 1 */
                }
                
                progress {
                  vertical-align: baseline;
                }
                
                textarea {
                  overflow: auto;
                }
                
                [type="checkbox"],
                [type="radio"] {
                  box-sizing: border-box; /* 1 */
                  padding: 0; /* 2 */
                }
                
                [type="number"]::-webkit-inner-spin-button,
                [type="number"]::-webkit-outer-spin-button {
                  height: auto;
                }
                
                [type="search"] {
                  -webkit-appearance: textfield; /* 1 */
                  outline-offset: -2px; /* 2 */
                }
                
                [type="search"]::-webkit-search-decoration {
                  -webkit-appearance: none;
                }
                
                ::-webkit-file-upload-button {
                  -webkit-appearance: button; /* 1 */
                  font: inherit; /* 2 */
                }
                
                details {
                  display: block;
                }
                
                summary {
                  display: list-item;
                }
                
                template {
                  display: none;
                }
                
                [hidden] {
                  display: none;
                }
                
                blockquote,
                dl,
                dd,
                h1,
                h2,
                h3,
                h4,
                h5,
                h6,
                hr,
                figure,
                p,
                pre {
                  margin: 0;
                }
                
                button {
                  background-color: transparent;
                  background-image: none;
                }
                
                button:focus {
                  outline: 1px dotted;
                  outline: 5px auto -webkit-focus-ring-color;
                }
                
                fieldset {
                  margin: 0;
                  padding: 0;
                }
                
                ol,
                ul {
                  list-style: none;
                  margin: 0;
                  padding: 0;
                }

                html {
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 1 */
                  line-height: 1.5; /* 2 */
                }
                
                *,
                ::before,
                ::after {
                  box-sizing: border-box; /* 1 */
                  border-width: 0; /* 2 */
                  border-style: solid; /* 2 */
                  border-color: #e2e8f0; /* 2 */
                }

                hr {
                  border-top-width: 1px;
                }

                img {
                  border-style: solid;
                }
                
                textarea {
                  resize: vertical;
                }
                
                input:-ms-input-placeholder, textarea:-ms-input-placeholder {
                  color: #a0aec0;
                }
                
                input::-ms-input-placeholder, textarea::-ms-input-placeholder {
                  color: #a0aec0;
                }
                
                input::placeholder,
                textarea::placeholder {
                  color: #a0aec0;
                }
                
                button,
                [role="button"] {
                  cursor: pointer;
                }
                
                table {
                  border-collapse: collapse;
                }
                
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                  font-size: inherit;
                  font-weight: inherit;
                }

                a {
                  color: inherit;
                  text-decoration: inherit;
                }

                button,
                input,
                optgroup,
                select,
                textarea {
                  padding: 0;
                  line-height: inherit;
                  color: inherit;
                }
                
                pre,
                code,
                kbd,
                samp {
                  font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                
                img,
                svg,
                video,
                canvas,
                audio,
                iframe,
                embed,
                object {
                  display: block;
                  vertical-align: middle;
                }
                
                img,
                video {
                  max-width: 100%;
                  height: auto;
                }
                
                .container {
                  width: 100%;
                }
                
                @media (min-width: 640px) {
                  .container {
                    max-width: 640px;
                  }
                }
                
                @media (min-width: 768px) {
                  .container {
                    max-width: 768px;
                  }
                }
                
                @media (min-width: 1024px) {
                  .container {
                    max-width: 1024px;
                  }
                }
                
                @media (min-width: 1280px) {
                  .container {
                    max-width: 1280px;
                  }
                }
                
                .bg-fixed {
                  background-attachment: fixed;
                }
                
                .bg-local {
                  background-attachment: local;
                }
                
                .bg-scroll {
                  background-attachment: scroll;
                }
                
                .bg-clip-border {
                  background-clip: border-box;
                }
                
                .bg-clip-padding {
                  background-clip: padding-box;
                }
                
                .bg-clip-content {
                  background-clip: content-box;
                }
                
                .bg-clip-text {
                  -webkit-background-clip: text;
                          background-clip: text;
                }
                
                .bg-transparent {
                  background-color: transparent;
                }
                
                .bg-current {
                  background-color: currentColor;
                }
                
                .bg-black {
                  --bg-opacity: 1;
                  background-color: #000;
                  background-color: rgba(0, 0, 0, 1);
                }
                
                .bg-white {
                  --bg-opacity: 1;
                  background-color: #fff;
                  background-color: rgba(255, 255, 255, 1);
                }
                
                .bg-gray-100 {
                  --bg-opacity: 1;
                  background-color: #f7fafc;
                  background-color: rgba(247, 250, 252, 1);
                }
                
                .bg-gray-200 {
                  --bg-opacity: 1;
                  background-color: #edf2f7;
                  background-color: rgba(237, 242, 247, 1);
                }
                
                .bg-gray-300 {
                  --bg-opacity: 1;
                  background-color: #e2e8f0;
                  background-color: rgba(226, 232, 240, 1);
                }
                
                .bg-gray-400 {
                  --bg-opacity: 1;
                  background-color: #cbd5e0;
                  background-color: rgba(203, 213, 224, 1);
                }
                
                .bg-gray-500 {
                  --bg-opacity: 1;
                  background-color: #a0aec0;
                  background-color: rgba(160, 174, 192, 1);
                }
                
                .bg-gray-600 {
                  --bg-opacity: 1;
                  background-color: #718096;
                  background-color: rgba(113, 128, 150, 1);
                }
                
                .bg-gray-700 {
                  --bg-opacity: 1;
                  background-color: #4a5568;
                  background-color: rgba(74, 85, 104, 1);
                }
                
                .bg-gray-800 {
                  --bg-opacity: 1;
                  background-color: #2d3748;
                  background-color: rgba(45, 55, 72, 1);
                }
                
                .bg-gray-900 {
                  --bg-opacity: 1;
                  background-color: #1a202c;
                  background-color: rgba(26, 32, 44, 1);
                }
                
                .bg-red-100 {
                  --bg-opacity: 1;
                  background-color: #fff5f5;
                  background-color: rgba(255, 245, 245, 1);
                }
                
                .bg-red-200 {
                  --bg-opacity: 1;
                  background-color: #fed7d7;
                  background-color: rgba(254, 215, 215, 1);
                }
                
                .bg-red-300 {
                  --bg-opacity: 1;
                  background-color: #feb2b2;
                  background-color: rgba(254, 178, 178, 1);
                }
                
                .bg-red-400 {
                  --bg-opacity: 1;
                  background-color: #fc8181;
                  background-color: rgba(252, 129, 129, 1);
                }
                
                .bg-red-500 {
                  --bg-opacity: 1;
                  background-color: #f56565;
                  background-color: rgba(245, 101, 101, 1);
                }
                
                .bg-red-600 {
                  --bg-opacity: 1;
                  background-color: #e53e3e;
                  background-color: rgba(229, 62, 62, 1);
                }
                
                .bg-red-700 {
                  --bg-opacity: 1;
                  background-color: #c53030;
                  background-color: rgba(197, 48, 48, 1);
                }
                
                .bg-red-800 {
                  --bg-opacity: 1;
                  background-color: #9b2c2c;
                  background-color: rgba(155, 44, 44, 1);
                }
                
                .bg-red-900 {
                  --bg-opacity: 1;
                  background-color: #742a2a;
                  background-color: rgba(116, 42, 42, 1);
                }
                
                .bg-orange-100 {
                  --bg-opacity: 1;
                  background-color: #fffaf0;
                  background-color: rgba(255, 250, 240, 1);
                }
                
                .bg-orange-200 {
                  --bg-opacity: 1;
                  background-color: #feebc8;
                  background-color: rgba(254, 235, 200, 1);
                }
                
                .bg-orange-300 {
                  --bg-opacity: 1;
                  background-color: #fbd38d;
                  background-color: rgba(251, 211, 141, 1);
                }
                
                .bg-orange-400 {
                  --bg-opacity: 1;
                  background-color: #f6ad55;
                  background-color: rgba(246, 173, 85, 1);
                }
                
                .bg-orange-500 {
                  --bg-opacity: 1;
                  background-color: #ed8936;
                  background-color: rgba(237, 137, 54, 1);
                }
                
                .bg-orange-600 {
                  --bg-opacity: 1;
                  background-color: #dd6b20;
                  background-color: rgba(221, 107, 32, 1);
                }
                
                .bg-orange-700 {
                  --bg-opacity: 1;
                  background-color: #c05621;
                  background-color: rgba(192, 86, 33, 1);
                }
                
                .bg-orange-800 {
                  --bg-opacity: 1;
                  background-color: #9c4221;
                  background-color: rgba(156, 66, 33, 1);
                }
                
                .bg-orange-900 {
                  --bg-opacity: 1;
                  background-color: #7b341e;
                  background-color: rgba(123, 52, 30, 1);
                }
                
                .bg-yellow-100 {
                  --bg-opacity: 1;
                  background-color: #fffff0;
                  background-color: rgba(255, 255, 240, 1);
                }
                
                .bg-yellow-200 {
                  --bg-opacity: 1;
                  background-color: #fefcbf;
                  background-color: rgba(254, 252, 191, 1);
                }
                
                .bg-yellow-300 {
                  --bg-opacity: 1;
                  background-color: #faf089;
                  background-color: rgba(250, 240, 137, 1);
                }
                
                .bg-yellow-400 {
                  --bg-opacity: 1;
                  background-color: #f6e05e;
                  background-color: rgba(246, 224, 94, 1);
                }
                
                .bg-yellow-500 {
                  --bg-opacity: 1;
                  background-color: #ecc94b;
                  background-color: rgba(236, 201, 75, 1);
                }
                
                .bg-yellow-600 {
                  --bg-opacity: 1;
                  background-color: #d69e2e;
                  background-color: rgba(214, 158, 46, 1);
                }
                
                .bg-yellow-700 {
                  --bg-opacity: 1;
                  background-color: #b7791f;
                  background-color: rgba(183, 121, 31, 1);
                }
                
                .bg-yellow-800 {
                  --bg-opacity: 1;
                  background-color: #975a16;
                  background-color: rgba(151, 90, 22, 1);
                }
                
                .bg-yellow-900 {
                  --bg-opacity: 1;
                  background-color: #744210;
                  background-color: rgba(116, 66, 16, 1);
                }
                
                .bg-green-100 {
                  --bg-opacity: 1;
                  background-color: #f0fff4;
                  background-color: rgba(240, 255, 244, 1);
                }
                
                .bg-green-200 {
                  --bg-opacity: 1;
                  background-color: #c6f6d5;
                  background-color: rgba(198, 246, 213, 1);
                }
                
                .bg-green-300 {
                  --bg-opacity: 1;
                  background-color: #9ae6b4;
                  background-color: rgba(154, 230, 180, 1);
                }
                
                .bg-green-400 {
                  --bg-opacity: 1;
                  background-color: #68d391;
                  background-color: rgba(104, 211, 145, 1);
                }
                
                .bg-green-500 {
                  --bg-opacity: 1;
                  background-color: #48bb78;
                  background-color: rgba(72, 187, 120, 1);
                }
                
                .bg-green-600 {
                  --bg-opacity: 1;
                  background-color: #38a169;
                  background-color: rgba(56, 161, 105, 1);
                }
                
                .bg-green-700 {
                  --bg-opacity: 1;
                  background-color: #2f855a;
                  background-color: rgba(47, 133, 90, 1);
                }
                
                .bg-green-800 {
                  --bg-opacity: 1;
                  background-color: #276749;
                  background-color: rgba(39, 103, 73, 1);
                }
                
                .bg-green-900 {
                  --bg-opacity: 1;
                  background-color: #22543d;
                  background-color: rgba(34, 84, 61, 1);
                }
                
                .bg-teal-100 {
                  --bg-opacity: 1;
                  background-color: #e6fffa;
                  background-color: rgba(230, 255, 250, 1);
                }
                
                .bg-teal-200 {
                  --bg-opacity: 1;
                  background-color: #b2f5ea;
                  background-color: rgba(178, 245, 234, 1);
                }
                
                .bg-teal-300 {
                  --bg-opacity: 1;
                  background-color: #81e6d9;
                  background-color: rgba(129, 230, 217, 1);
                }
                
                .bg-teal-400 {
                  --bg-opacity: 1;
                  background-color: #4fd1c5;
                  background-color: rgba(79, 209, 197, 1);
                }
                
                .bg-teal-500 {
                  --bg-opacity: 1;
                  background-color: #38b2ac;
                  background-color: rgba(56, 178, 172, 1);
                }
                
                .bg-teal-600 {
                  --bg-opacity: 1;
                  background-color: #319795;
                  background-color: rgba(49, 151, 149, 1);
                }
                
                .bg-teal-700 {
                  --bg-opacity: 1;
                  background-color: #2c7a7b;
                  background-color: rgba(44, 122, 123, 1);
                }
                
                .bg-teal-800 {
                  --bg-opacity: 1;
                  background-color: #285e61;
                  background-color: rgba(40, 94, 97, 1);
                }
                
                .bg-teal-900 {
                  --bg-opacity: 1;
                  background-color: #234e52;
                  background-color: rgba(35, 78, 82, 1);
                }
                
                .bg-blue-100 {
                  --bg-opacity: 1;
                  background-color: #ebf8ff;
                  background-color: rgba(235, 248, 255, 1);
                }
                
                .bg-blue-200 {
                  --bg-opacity: 1;
                  background-color: #bee3f8;
                  background-color: rgba(190, 227, 248, 1);
                }
                
                .bg-blue-300 {
                  --bg-opacity: 1;
                  background-color: #90cdf4;
                  background-color: rgba(144, 205, 244, 1);
                }
                
                .bg-blue-400 {
                  --bg-opacity: 1;
                  background-color: #63b3ed;
                  background-color: rgba(99, 179, 237, 1);
                }
                
                .bg-blue-500 {
                  --bg-opacity: 1;
                  background-color: #4299e1;
                  background-color: rgba(66, 153, 225, 1);
                }
                
                .bg-blue-600 {
                  --bg-opacity: 1;
                  background-color: #3182ce;
                  background-color: rgba(49, 130, 206, 1);
                }
                
                .bg-blue-700 {
                  --bg-opacity: 1;
                  background-color: #2b6cb0;
                  background-color: rgba(43, 108, 176, 1);
                }
                
                .bg-blue-800 {
                  --bg-opacity: 1;
                  background-color: #2c5282;
                  background-color: rgba(44, 82, 130, 1);
                }
                
                .bg-blue-900 {
                  --bg-opacity: 1;
                  background-color: #2a4365;
                  background-color: rgba(42, 67, 101, 1);
                }
                
                .bg-indigo-100 {
                  --bg-opacity: 1;
                  background-color: #ebf4ff;
                  background-color: rgba(235, 244, 255, 1);
                }
                
                .bg-indigo-200 {
                  --bg-opacity: 1;
                  background-color: #c3dafe;
                  background-color: rgba(195, 218, 254, 1);
                }
                
                .bg-indigo-300 {
                  --bg-opacity: 1;
                  background-color: #a3bffa;
                  background-color: rgba(163, 191, 250, 1);
                }
                
                .bg-indigo-400 {
                  --bg-opacity: 1;
                  background-color: #7f9cf5;
                  background-color: rgba(127, 156, 245, 1);
                }
                
                .bg-indigo-500 {
                  --bg-opacity: 1;
                  background-color: #667eea;
                  background-color: rgba(102, 126, 234, 1);
                }
                
                .bg-indigo-600 {
                  --bg-opacity: 1;
                  background-color: #5a67d8;
                  background-color: rgba(90, 103, 216, 1);
                }
                
                .bg-indigo-700 {
                  --bg-opacity: 1;
                  background-color: #4c51bf;
                  background-color: rgba(76, 81, 191, 1);
                }
                
                .bg-indigo-800 {
                  --bg-opacity: 1;
                  background-color: #434190;
                  background-color: rgba(67, 65, 144, 1);
                }
                
                .bg-indigo-900 {
                  --bg-opacity: 1;
                  background-color: #3c366b;
                  background-color: rgba(60, 54, 107, 1);
                }
                
                .bg-purple-100 {
                  --bg-opacity: 1;
                  background-color: #faf5ff;
                  background-color: rgba(250, 245, 255, 1);
                }
                
                .bg-purple-200 {
                  --bg-opacity: 1;
                  background-color: #e9d8fd;
                  background-color: rgba(233, 216, 253, 1);
                }
                
                .bg-purple-300 {
                  --bg-opacity: 1;
                  background-color: #d6bcfa;
                  background-color: rgba(214, 188, 250, 1);
                }
                
                .bg-purple-400 {
                  --bg-opacity: 1;
                  background-color: #b794f4;
                  background-color: rgba(183, 148, 244, 1);
                }
                
                .bg-purple-500 {
                  --bg-opacity: 1;
                  background-color: #9f7aea;
                  background-color: rgba(159, 122, 234, 1);
                }
                
                .bg-purple-600 {
                  --bg-opacity: 1;
                  background-color: #805ad5;
                  background-color: rgba(128, 90, 213, 1);
                }
                
                .bg-purple-700 {
                  --bg-opacity: 1;
                  background-color: #6b46c1;
                  background-color: rgba(107, 70, 193, 1);
                }
                
                .bg-purple-800 {
                  --bg-opacity: 1;
                  background-color: #553c9a;
                  background-color: rgba(85, 60, 154, 1);
                }
                
                .bg-purple-900 {
                  --bg-opacity: 1;
                  background-color: #44337a;
                  background-color: rgba(68, 51, 122, 1);
                }
                
                .bg-pink-100 {
                  --bg-opacity: 1;
                  background-color: #fff5f7;
                  background-color: rgba(255, 245, 247, 1);
                }
                
                .bg-pink-200 {
                  --bg-opacity: 1;
                  background-color: #fed7e2;
                  background-color: rgba(254, 215, 226, 1);
                }
                
                .bg-pink-300 {
                  --bg-opacity: 1;
                  background-color: #fbb6ce;
                  background-color: rgba(251, 182, 206, 1);
                }
                
                .bg-pink-400 {
                  --bg-opacity: 1;
                  background-color: #f687b3;
                  background-color: rgba(246, 135, 179, 1);
                }
                
                .bg-pink-500 {
                  --bg-opacity: 1;
                  background-color: #ed64a6;
                  background-color: rgba(237, 100, 166, 1);
                }
                
                .bg-pink-600 {
                  --bg-opacity: 1;
                  background-color: #d53f8c;
                  background-color: rgba(213, 63, 140, 1);
                }
                
                .bg-pink-700 {
                  --bg-opacity: 1;
                  background-color: #b83280;
                  background-color: rgba(184, 50, 128, 1);
                }
                
                .bg-pink-800 {
                  --bg-opacity: 1;
                  background-color: #97266d;
                  background-color: rgba(151, 38, 109, 1);
                }
                
                .bg-pink-900 {
                  --bg-opacity: 1;
                  background-color: #702459;
                  background-color: rgba(112, 36, 89, 1);
                }
                
                .bg-none {
                  background-image: none;
                }
                
                .bg-opacity-0 {
                  --bg-opacity: 0;
                }
                
                .bg-opacity-25 {
                  --bg-opacity: 0.25;
                }
                
                .bg-opacity-50 {
                  --bg-opacity: 0.5;
                }
                
                .bg-opacity-75 {
                  --bg-opacity: 0.75;
                }
                
                .bg-opacity-100 {
                  --bg-opacity: 1;
                }
                
                .bg-bottom {
                  background-position: bottom;
                }
                
                .bg-center {
                  background-position: center;
                }
                
                .bg-left {
                  background-position: left;
                }
                
                .bg-left-bottom {
                  background-position: left bottom;
                }
                
                .bg-left-top {
                  background-position: left top;
                }
                
                .bg-right {
                  background-position: right;
                }
                
                .bg-right-bottom {
                  background-position: right bottom;
                }
                
                .bg-right-top {
                  background-position: right top;
                }
                
                .bg-top {
                  background-position: top;
                }
                
                .bg-repeat {
                  background-repeat: repeat;
                }
                
                .bg-no-repeat {
                  background-repeat: no-repeat;
                }
                
                .bg-repeat-x {
                  background-repeat: repeat-x;
                }
                
                .bg-repeat-y {
                  background-repeat: repeat-y;
                }
                
                .bg-repeat-round {
                  background-repeat: round;
                }
                
                .bg-repeat-space {
                  background-repeat: space;
                }
                
                .bg-auto {
                  background-size: auto;
                }
                
                .bg-cover {
                  background-size: cover;
                }
                
                .bg-contain {
                  background-size: contain;
                }
                
                .border-collapse {
                  border-collapse: collapse;
                }
                
                .border-separate {
                  border-collapse: separate;
                }
                
                .border-transparent {
                  border-color: transparent;
                }
                
                .border-current {
                  border-color: currentColor;
                }
                
                .border-black {
                  --border-opacity: 1;
                  border-color: #000;
                  border-color: rgba(0, 0, 0, 1);
                }
                
                .border-white {
                  --border-opacity: 1;
                  border-color: #fff;
                  border-color: rgba(255, 255, 255, 1);
                }
                
                .border-gray-100 {
                  --border-opacity: 1;
                  border-color: #f7fafc;
                  border-color: rgba(247, 250, 252, 1);
                }
                
                .border-gray-200 {
                  --border-opacity: 1;
                  border-color: #edf2f7;
                  border-color: rgba(237, 242, 247, 1);
                }
                
                .border-gray-300 {
                  --border-opacity: 1;
                  border-color: #e2e8f0;
                  border-color: rgba(226, 232, 240, 1);
                }
                
                .border-gray-400 {
                  --border-opacity: 1;
                  border-color: #cbd5e0;
                  border-color: rgba(203, 213, 224, 1);
                }
                
                .border-gray-500 {
                  --border-opacity: 1;
                  border-color: #a0aec0;
                  border-color: rgba(160, 174, 192, 1);
                }
                
                .border-gray-600 {
                  --border-opacity: 1;
                  border-color: #718096;
                  border-color: rgba(113, 128, 150, 1);
                }
                
                .border-gray-700 {
                  --border-opacity: 1;
                  border-color: #4a5568;
                  border-color: rgba(74, 85, 104, 1);
                }
                
                .border-gray-800 {
                  --border-opacity: 1;
                  border-color: #2d3748;
                  border-color: rgba(45, 55, 72, 1);
                }
                
                .border-gray-900 {
                  --border-opacity: 1;
                  border-color: #1a202c;
                  border-color: rgba(26, 32, 44, 1);
                }
                
                .border-red-100 {
                  --border-opacity: 1;
                  border-color: #fff5f5;
                  border-color: rgba(255, 245, 245, 1);
                }
                
                .border-red-200 {
                  --border-opacity: 1;
                  border-color: #fed7d7;
                  border-color: rgba(254, 215, 215, 1);
                }
                
                .border-red-300 {
                  --border-opacity: 1;
                  border-color: #feb2b2;
                  border-color: rgba(254, 178, 178, 1);
                }
                
                .border-red-400 {
                  --border-opacity: 1;
                  border-color: #fc8181;
                  border-color: rgba(252, 129, 129, 1);
                }
                
                .border-red-500 {
                  --border-opacity: 1;
                  border-color: #f56565;
                  border-color: rgba(245, 101, 101, 1);
                }
                
                .border-red-600 {
                  --border-opacity: 1;
                  border-color: #e53e3e;
                  border-color: rgba(229, 62, 62, 1);
                }
                
                .border-red-700 {
                  --border-opacity: 1;
                  border-color: #c53030;
                  border-color: rgba(197, 48, 48, 1);
                }
                
                .border-red-800 {
                  --border-opacity: 1;
                  border-color: #9b2c2c;
                  border-color: rgba(155, 44, 44, 1);
                }
                
                .border-red-900 {
                  --border-opacity: 1;
                  border-color: #742a2a;
                  border-color: rgba(116, 42, 42, 1);
                }
                
                .border-orange-100 {
                  --border-opacity: 1;
                  border-color: #fffaf0;
                  border-color: rgba(255, 250, 240, 1);
                }
                
                .border-orange-200 {
                  --border-opacity: 1;
                  border-color: #feebc8;
                  border-color: rgba(254, 235, 200, 1);
                }
                
                .border-orange-300 {
                  --border-opacity: 1;
                  border-color: #fbd38d;
                  border-color: rgba(251, 211, 141, 1);
                }
                
                .border-orange-400 {
                  --border-opacity: 1;
                  border-color: #f6ad55;
                  border-color: rgba(246, 173, 85, 1);
                }
                
                .border-orange-500 {
                  --border-opacity: 1;
                  border-color: #ed8936;
                  border-color: rgba(237, 137, 54, 1);
                }
                
                .border-orange-600 {
                  --border-opacity: 1;
                  border-color: #dd6b20;
                  border-color: rgba(221, 107, 32, 1);
                }
                
                .border-orange-700 {
                  --border-opacity: 1;
                  border-color: #c05621;
                  border-color: rgba(192, 86, 33, 1);
                }
                
                .border-orange-800 {
                  --border-opacity: 1;
                  border-color: #9c4221;
                  border-color: rgba(156, 66, 33, 1);
                }
                
                .border-orange-900 {
                  --border-opacity: 1;
                  border-color: #7b341e;
                  border-color: rgba(123, 52, 30, 1);
                }
                
                .border-yellow-100 {
                  --border-opacity: 1;
                  border-color: #fffff0;
                  border-color: rgba(255, 255, 240, 1);
                }
                
                .border-yellow-200 {
                  --border-opacity: 1;
                  border-color: #fefcbf;
                  border-color: rgba(254, 252, 191, 1);
                }
                
                .border-yellow-300 {
                  --border-opacity: 1;
                  border-color: #faf089;
                  border-color: rgba(250, 240, 137, 1);
                }
                
                .border-yellow-400 {
                  --border-opacity: 1;
                  border-color: #f6e05e;
                  border-color: rgba(246, 224, 94, 1);
                }
                
                .border-yellow-500 {
                  --border-opacity: 1;
                  border-color: #ecc94b;
                  border-color: rgba(236, 201, 75, 1);
                }
                
                .border-yellow-600 {
                  --border-opacity: 1;
                  border-color: #d69e2e;
                  border-color: rgba(214, 158, 46, 1);
                }
                
                .border-yellow-700 {
                  --border-opacity: 1;
                  border-color: #b7791f;
                  border-color: rgba(183, 121, 31, 1);
                }
                
                .border-yellow-800 {
                  --border-opacity: 1;
                  border-color: #975a16;
                  border-color: rgba(151, 90, 22, 1);
                }
                
                .border-yellow-900 {
                  --border-opacity: 1;
                  border-color: #744210;
                  border-color: rgba(116, 66, 16, 1);
                }
                
                .border-green-100 {
                  --border-opacity: 1;
                  border-color: #f0fff4;
                  border-color: rgba(240, 255, 244, 1);
                }
                
                .border-green-200 {
                  --border-opacity: 1;
                  border-color: #c6f6d5;
                  border-color: rgba(198, 246, 213, 1);
                }
                
                .border-green-300 {
                  --border-opacity: 1;
                  border-color: #9ae6b4;
                  border-color: rgba(154, 230, 180, 1);
                }
                
                .border-green-400 {
                  --border-opacity: 1;
                  border-color: #68d391;
                  border-color: rgba(104, 211, 145, 1);
                }
                
                .border-green-500 {
                  --border-opacity: 1;
                  border-color: #48bb78;
                  border-color: rgba(72, 187, 120, 1);
                }
                
                .border-green-600 {
                  --border-opacity: 1;
                  border-color: #38a169;
                  border-color: rgba(56, 161, 105, 1);
                }
                
                .border-green-700 {
                  --border-opacity: 1;
                  border-color: #2f855a;
                  border-color: rgba(47, 133, 90, 1);
                }
                
                .border-green-800 {
                  --border-opacity: 1;
                  border-color: #276749;
                  border-color: rgba(39, 103, 73, 1);
                }
                
                .border-green-900 {
                  --border-opacity: 1;
                  border-color: #22543d;
                  border-color: rgba(34, 84, 61, 1);
                }
                
                .border-teal-100 {
                  --border-opacity: 1;
                  border-color: #e6fffa;
                  border-color: rgba(230, 255, 250, 1);
                }
                
                .border-teal-200 {
                  --border-opacity: 1;
                  border-color: #b2f5ea;
                  border-color: rgba(178, 245, 234, 1);
                }
                
                .border-teal-300 {
                  --border-opacity: 1;
                  border-color: #81e6d9;
                  border-color: rgba(129, 230, 217, 1);
                }
                
                .border-teal-400 {
                  --border-opacity: 1;
                  border-color: #4fd1c5;
                  border-color: rgba(79, 209, 197, 1);
                }
                
                .border-teal-500 {
                  --border-opacity: 1;
                  border-color: #38b2ac;
                  border-color: rgba(56, 178, 172, 1);
                }
                
                .border-teal-600 {
                  --border-opacity: 1;
                  border-color: #319795;
                  border-color: rgba(49, 151, 149, 1);
                }
                
                .border-teal-700 {
                  --border-opacity: 1;
                  border-color: #2c7a7b;
                  border-color: rgba(44, 122, 123, 1);
                }
                
                .border-teal-800 {
                  --border-opacity: 1;
                  border-color: #285e61;
                  border-color: rgba(40, 94, 97, 1);
                }
                
                .border-teal-900 {
                  --border-opacity: 1;
                  border-color: #234e52;
                  border-color: rgba(35, 78, 82, 1);
                }
                
                .border-blue-100 {
                  --border-opacity: 1;
                  border-color: #ebf8ff;
                  border-color: rgba(235, 248, 255, 1);
                }
                
                .border-blue-200 {
                  --border-opacity: 1;
                  border-color: #bee3f8;
                  border-color: rgba(190, 227, 248, 1);
                }
                
                .border-blue-300 {
                  --border-opacity: 1;
                  border-color: #90cdf4;
                  border-color: rgba(144, 205, 244, 1);
                }
                
                .border-blue-400 {
                  --border-opacity: 1;
                  border-color: #63b3ed;
                  border-color: rgba(99, 179, 237, 1);
                }
                
                .border-blue-500 {
                  --border-opacity: 1;
                  border-color: #4299e1;
                  border-color: rgba(66, 153, 225, 1);
                }
                
                .border-blue-600 {
                  --border-opacity: 1;
                  border-color: #3182ce;
                  border-color: rgba(49, 130, 206, 1);
                }
                
                .border-blue-700 {
                  --border-opacity: 1;
                  border-color: #2b6cb0;
                  border-color: rgba(43, 108, 176, 1);
                }
                
                .border-blue-800 {
                  --border-opacity: 1;
                  border-color: #2c5282;
                  border-color: rgba(44, 82, 130, 1);
                }
                
                .border-blue-900 {
                  --border-opacity: 1;
                  border-color: #2a4365;
                  border-color: rgba(42, 67, 101, 1);
                }
                
                .border-indigo-100 {
                  --border-opacity: 1;
                  border-color: #ebf4ff;
                  border-color: rgba(235, 244, 255, 1);
                }
                
                .border-indigo-200 {
                  --border-opacity: 1;
                  border-color: #c3dafe;
                  border-color: rgba(195, 218, 254, 1);
                }
                
                .border-indigo-300 {
                  --border-opacity: 1;
                  border-color: #a3bffa;
                  border-color: rgba(163, 191, 250, 1);
                }
                
                .border-indigo-400 {
                  --border-opacity: 1;
                  border-color: #7f9cf5;
                  border-color: rgba(127, 156, 245, 1);
                }
                
                .border-indigo-500 {
                  --border-opacity: 1;
                  border-color: #667eea;
                  border-color: rgba(102, 126, 234, 1);
                }
                
                .border-indigo-600 {
                  --border-opacity: 1;
                  border-color: #5a67d8;
                  border-color: rgba(90, 103, 216, 1);
                }
                
                .border-indigo-700 {
                  --border-opacity: 1;
                  border-color: #4c51bf;
                  border-color: rgba(76, 81, 191, 1);
                }
                
                .border-indigo-800 {
                  --border-opacity: 1;
                  border-color: #434190;
                  border-color: rgba(67, 65, 144, 1);
                }
                
                .border-indigo-900 {
                  --border-opacity: 1;
                  border-color: #3c366b;
                  border-color: rgba(60, 54, 107, 1);
                }
                
                .border-purple-100 {
                  --border-opacity: 1;
                  border-color: #faf5ff;
                  border-color: rgba(250, 245, 255, 1);
                }
                
                .border-purple-200 {
                  --border-opacity: 1;
                  border-color: #e9d8fd;
                  border-color: rgba(233, 216, 253, 1);
                }
                
                .border-purple-300 {
                  --border-opacity: 1;
                  border-color: #d6bcfa;
                  border-color: rgba(214, 188, 250, 1);
                }
                
                .border-purple-400 {
                  --border-opacity: 1;
                  border-color: #b794f4;
                  border-color: rgba(183, 148, 244, 1);
                }
                
                .border-purple-500 {
                  --border-opacity: 1;
                  border-color: #9f7aea;
                  border-color: rgba(159, 122, 234, 1);
                }
                
                .border-purple-600 {
                  --border-opacity: 1;
                  border-color: #805ad5;
                  border-color: rgba(128, 90, 213, 1);
                }
                
                .border-purple-700 {
                  --border-opacity: 1;
                  border-color: #6b46c1;
                  border-color: rgba(107, 70, 193, 1);
                }
                
                .border-purple-800 {
                  --border-opacity: 1;
                  border-color: #553c9a;
                  border-color: rgba(85, 60, 154, 1);
                }
                
                .border-purple-900 {
                  --border-opacity: 1;
                  border-color: #44337a;
                  border-color: rgba(68, 51, 122, 1);
                }
                
                .border-pink-100 {
                  --border-opacity: 1;
                  border-color: #fff5f7;
                  border-color: rgba(255, 245, 247, 1);
                }
                
                .border-pink-200 {
                  --border-opacity: 1;
                  border-color: #fed7e2;
                  border-color: rgba(254, 215, 226, 1);
                }
                
                .border-pink-300 {
                  --border-opacity: 1;
                  border-color: #fbb6ce;
                  border-color: rgba(251, 182, 206, 1);
                }
                
                .border-pink-400 {
                  --border-opacity: 1;
                  border-color: #f687b3;
                  border-color: rgba(246, 135, 179, 1);
                }
                
                .border-pink-500 {
                  --border-opacity: 1;
                  border-color: #ed64a6;
                  border-color: rgba(237, 100, 166, 1);
                }
                
                .border-pink-600 {
                  --border-opacity: 1;
                  border-color: #d53f8c;
                  border-color: rgba(213, 63, 140, 1);
                }
                
                .border-pink-700 {
                  --border-opacity: 1;
                  border-color: #b83280;
                  border-color: rgba(184, 50, 128, 1);
                }
                
                .border-pink-800 {
                  --border-opacity: 1;
                  border-color: #97266d;
                  border-color: rgba(151, 38, 109, 1);
                }
                
                .border-pink-900 {
                  --border-opacity: 1;
                  border-color: #702459;
                  border-color: rgba(112, 36, 89, 1);
                }
                
                .border-opacity-0 {
                  --border-opacity: 0;
                }
                
                .border-opacity-25 {
                  --border-opacity: 0.25;
                }
                
                .border-opacity-50 {
                  --border-opacity: 0.5;
                }
                
                .border-opacity-75 {
                  --border-opacity: 0.75;
                }
                
                .border-opacity-100 {
                  --border-opacity: 1;
                }
                
                .rounded-none {
                  border-radius: 0;
                }
                
                .rounded-sm {
                  border-radius: 0.125rem;
                }
                
                .rounded {
                  border-radius: 0.25rem;
                }
                
                .rounded-md {
                  border-radius: 0.375rem;
                }
                
                .rounded-lg {
                  border-radius: 0.5rem;
                }
                
                .rounded-xl {
                  border-radius: 0.75rem;
                }
                
                .rounded-2xl {
                  border-radius: 1rem;
                }
                
                .rounded-3xl {
                  border-radius: 1.5rem;
                }
                
                .rounded-full {
                  border-radius: 9999px;
                }
                
                .rounded-t-none {
                  border-top-left-radius: 0;
                  border-top-right-radius: 0;
                }
                
                .rounded-r-none {
                  border-top-right-radius: 0;
                  border-bottom-right-radius: 0;
                }
                
                .rounded-b-none {
                  border-bottom-right-radius: 0;
                  border-bottom-left-radius: 0;
                }
                
                .rounded-l-none {
                  border-top-left-radius: 0;
                  border-bottom-left-radius: 0;
                }
                
                .rounded-t-sm {
                  border-top-left-radius: 0.125rem;
                  border-top-right-radius: 0.125rem;
                }
                
                .rounded-r-sm {
                  border-top-right-radius: 0.125rem;
                  border-bottom-right-radius: 0.125rem;
                }
                
                .rounded-b-sm {
                  border-bottom-right-radius: 0.125rem;
                  border-bottom-left-radius: 0.125rem;
                }
                
                .rounded-l-sm {
                  border-top-left-radius: 0.125rem;
                  border-bottom-left-radius: 0.125rem;
                }
                
                .rounded-t {
                  border-top-left-radius: 0.25rem;
                  border-top-right-radius: 0.25rem;
                }
                
                .rounded-r {
                  border-top-right-radius: 0.25rem;
                  border-bottom-right-radius: 0.25rem;
                }
                
                .rounded-b {
                  border-bottom-right-radius: 0.25rem;
                  border-bottom-left-radius: 0.25rem;
                }
                
                .rounded-l {
                  border-top-left-radius: 0.25rem;
                  border-bottom-left-radius: 0.25rem;
                }
                
                .rounded-t-md {
                  border-top-left-radius: 0.375rem;
                  border-top-right-radius: 0.375rem;
                }
                
                .rounded-r-md {
                  border-top-right-radius: 0.375rem;
                  border-bottom-right-radius: 0.375rem;
                }
                
                .rounded-b-md {
                  border-bottom-right-radius: 0.375rem;
                  border-bottom-left-radius: 0.375rem;
                }
                
                .rounded-l-md {
                  border-top-left-radius: 0.375rem;
                  border-bottom-left-radius: 0.375rem;
                }
                
                .rounded-t-lg {
                  border-top-left-radius: 0.5rem;
                  border-top-right-radius: 0.5rem;
                }
                
                .rounded-r-lg {
                  border-top-right-radius: 0.5rem;
                  border-bottom-right-radius: 0.5rem;
                }
                
                .rounded-b-lg {
                  border-bottom-right-radius: 0.5rem;
                  border-bottom-left-radius: 0.5rem;
                }
                
                .rounded-l-lg {
                  border-top-left-radius: 0.5rem;
                  border-bottom-left-radius: 0.5rem;
                }
                
                .rounded-t-xl {
                  border-top-left-radius: 0.75rem;
                  border-top-right-radius: 0.75rem;
                }
                
                .rounded-r-xl {
                  border-top-right-radius: 0.75rem;
                  border-bottom-right-radius: 0.75rem;
                }
                
                .rounded-b-xl {
                  border-bottom-right-radius: 0.75rem;
                  border-bottom-left-radius: 0.75rem;
                }
                
                .rounded-l-xl {
                  border-top-left-radius: 0.75rem;
                  border-bottom-left-radius: 0.75rem;
                }
                
                .rounded-t-2xl {
                  border-top-left-radius: 1rem;
                  border-top-right-radius: 1rem;
                }
                
                .rounded-r-2xl {
                  border-top-right-radius: 1rem;
                  border-bottom-right-radius: 1rem;
                }
                
                .rounded-b-2xl {
                  border-bottom-right-radius: 1rem;
                  border-bottom-left-radius: 1rem;
                }
                
                .rounded-l-2xl {
                  border-top-left-radius: 1rem;
                  border-bottom-left-radius: 1rem;
                }
                
                .rounded-t-3xl {
                  border-top-left-radius: 1.5rem;
                  border-top-right-radius: 1.5rem;
                }
                
                .rounded-r-3xl {
                  border-top-right-radius: 1.5rem;
                  border-bottom-right-radius: 1.5rem;
                }
                
                .rounded-b-3xl {
                  border-bottom-right-radius: 1.5rem;
                  border-bottom-left-radius: 1.5rem;
                }
                
                .rounded-l-3xl {
                  border-top-left-radius: 1.5rem;
                  border-bottom-left-radius: 1.5rem;
                }
                
                .rounded-t-full {
                  border-top-left-radius: 9999px;
                  border-top-right-radius: 9999px;
                }
                
                .rounded-r-full {
                  border-top-right-radius: 9999px;
                  border-bottom-right-radius: 9999px;
                }
                
                .rounded-b-full {
                  border-bottom-right-radius: 9999px;
                  border-bottom-left-radius: 9999px;
                }
                
                .rounded-l-full {
                  border-top-left-radius: 9999px;
                  border-bottom-left-radius: 9999px;
                }
                
                .rounded-tl-none {
                  border-top-left-radius: 0;
                }
                
                .rounded-tr-none {
                  border-top-right-radius: 0;
                }
                
                .rounded-br-none {
                  border-bottom-right-radius: 0;
                }
                
                .rounded-bl-none {
                  border-bottom-left-radius: 0;
                }
                
                .rounded-tl-sm {
                  border-top-left-radius: 0.125rem;
                }
                
                .rounded-tr-sm {
                  border-top-right-radius: 0.125rem;
                }
                
                .rounded-br-sm {
                  border-bottom-right-radius: 0.125rem;
                }
                
                .rounded-bl-sm {
                  border-bottom-left-radius: 0.125rem;
                }
                
                .rounded-tl {
                  border-top-left-radius: 0.25rem;
                }
                
                .rounded-tr {
                  border-top-right-radius: 0.25rem;
                }
                
                .rounded-br {
                  border-bottom-right-radius: 0.25rem;
                }
                
                .rounded-bl {
                  border-bottom-left-radius: 0.25rem;
                }
                
                .rounded-tl-md {
                  border-top-left-radius: 0.375rem;
                }
                
                .rounded-tr-md {
                  border-top-right-radius: 0.375rem;
                }
                
                .rounded-br-md {
                  border-bottom-right-radius: 0.375rem;
                }
                
                .rounded-bl-md {
                  border-bottom-left-radius: 0.375rem;
                }
                
                .rounded-tl-lg {
                  border-top-left-radius: 0.5rem;
                }
                
                .rounded-tr-lg {
                  border-top-right-radius: 0.5rem;
                }
                
                .rounded-br-lg {
                  border-bottom-right-radius: 0.5rem;
                }
                
                .rounded-bl-lg {
                  border-bottom-left-radius: 0.5rem;
                }
                
                .rounded-tl-xl {
                  border-top-left-radius: 0.75rem;
                }
                
                .rounded-tr-xl {
                  border-top-right-radius: 0.75rem;
                }
                
                .rounded-br-xl {
                  border-bottom-right-radius: 0.75rem;
                }
                
                .rounded-bl-xl {
                  border-bottom-left-radius: 0.75rem;
                }
                
                .rounded-tl-2xl {
                  border-top-left-radius: 1rem;
                }
                
                .rounded-tr-2xl {
                  border-top-right-radius: 1rem;
                }
                
                .rounded-br-2xl {
                  border-bottom-right-radius: 1rem;
                }
                
                .rounded-bl-2xl {
                  border-bottom-left-radius: 1rem;
                }
                
                .rounded-tl-3xl {
                  border-top-left-radius: 1.5rem;
                }
                
                .rounded-tr-3xl {
                  border-top-right-radius: 1.5rem;
                }
                
                .rounded-br-3xl {
                  border-bottom-right-radius: 1.5rem;
                }
                
                .rounded-bl-3xl {
                  border-bottom-left-radius: 1.5rem;
                }
                
                .rounded-tl-full {
                  border-top-left-radius: 9999px;
                }
                
                .rounded-tr-full {
                  border-top-right-radius: 9999px;
                }
                
                .rounded-br-full {
                  border-bottom-right-radius: 9999px;
                }
                
                .rounded-bl-full {
                  border-bottom-left-radius: 9999px;
                }
                
                .border-solid {
                  border-style: solid;
                }
                
                .border-dashed {
                  border-style: dashed;
                }
                
                .border-dotted {
                  border-style: dotted;
                }
                
                .border-double {
                  border-style: double;
                }
                
                .border-none {
                  border-style: none;
                }
                
                .border-0 {
                  border-width: 0;
                }
                
                .border-2 {
                  border-width: 2px;
                }
                
                .border-4 {
                  border-width: 4px;
                }
                
                .border-8 {
                  border-width: 8px;
                }
                
                .border {
                  border-width: 1px;
                }
                
                .border-t-0 {
                  border-top-width: 0;
                }
                
                .border-r-0 {
                  border-right-width: 0;
                }
                
                .border-b-0 {
                  border-bottom-width: 0;
                }
                
                .border-l-0 {
                  border-left-width: 0;
                }
                
                .border-t-2 {
                  border-top-width: 2px;
                }
                
                .border-r-2 {
                  border-right-width: 2px;
                }
                
                .border-b-2 {
                  border-bottom-width: 2px;
                }
                
                .border-l-2 {
                  border-left-width: 2px;
                }
                
                .border-t-4 {
                  border-top-width: 4px;
                }
                
                .border-r-4 {
                  border-right-width: 4px;
                }
                
                .border-b-4 {
                  border-bottom-width: 4px;
                }
                
                .border-l-4 {
                  border-left-width: 4px;
                }
                
                .border-t-8 {
                  border-top-width: 8px;
                }
                
                .border-r-8 {
                  border-right-width: 8px;
                }
                
                .border-b-8 {
                  border-bottom-width: 8px;
                }
                
                .border-l-8 {
                  border-left-width: 8px;
                }
                
                .border-t {
                  border-top-width: 1px;
                }
                
                .border-r {
                  border-right-width: 1px;
                }
                
                .border-b {
                  border-bottom-width: 1px;
                }
                
                .border-l {
                  border-left-width: 1px;
                }
                
                .box-border {
                  box-sizing: border-box;
                }
                
                .box-content {
                  box-sizing: content-box;
                }
                
                .cursor-auto {
                  cursor: auto;
                }
                
                .cursor-default {
                  cursor: default;
                }
                
                .cursor-pointer {
                  cursor: pointer;
                }
                
                .cursor-wait {
                  cursor: wait;
                }
                
                .cursor-text {
                  cursor: text;
                }
                
                .cursor-move {
                  cursor: move;
                }
                
                .cursor-not-allowed {
                  cursor: not-allowed;
                }
                
                .block {
                  display: block;
                }
                
                .inline-block {
                  display: inline-block;
                }
                
                .inline {
                  display: inline;
                }
                
                .flex {
                  display: flex;
                }
                
                .inline-flex {
                  display: inline-flex;
                }
                
                .table {
                  display: table;
                }
                
                .table-caption {
                  display: table-caption;
                }
                
                .table-cell {
                  display: table-cell;
                }
                
                .table-column {
                  display: table-column;
                }
                
                .table-column-group {
                  display: table-column-group;
                }
                
                .table-footer-group {
                  display: table-footer-group;
                }
                
                .table-header-group {
                  display: table-header-group;
                }
                
                .table-row-group {
                  display: table-row-group;
                }
                
                .table-row {
                  display: table-row;
                }
                
                .flow-root {
                  display: flow-root;
                }
                
                .grid {
                  display: grid;
                }
                
                .inline-grid {
                  display: inline-grid;
                }
                
                .contents {
                  display: contents;
                }
                
                .hidden {
                  display: none;
                }
                
                .flex-row {
                  flex-direction: row;
                }
                
                .flex-row-reverse {
                  flex-direction: row-reverse;
                }
                
                .flex-col {
                  flex-direction: column;
                }
                
                .flex-col-reverse {
                  flex-direction: column-reverse;
                }
                
                .flex-wrap {
                  flex-wrap: wrap;
                }
                
                .flex-wrap-reverse {
                  flex-wrap: wrap-reverse;
                }
                
                .flex-no-wrap {
                  flex-wrap: nowrap;
                }
                
                .place-items-start {
                  place-items: start;
                }
                
                .place-items-end {
                  place-items: end;
                }
                
                .place-items-center {
                  place-items: center;
                }
                
                .place-items-stretch {
                  place-items: stretch;
                }
                
                .place-content-center {
                  place-content: center;
                }
                
                .place-content-start {
                  place-content: start;
                }
                
                .place-content-end {
                  place-content: end;
                }
                
                .place-content-between {
                  place-content: space-between;
                }
                
                .place-content-around {
                  place-content: space-around;
                }
                
                .place-content-evenly {
                  place-content: space-evenly;
                }
                
                .place-content-stretch {
                  place-content: stretch;
                }
                
                .place-self-auto {
                  place-self: auto;
                }
                
                .place-self-start {
                  place-self: start;
                }
                
                .place-self-end {
                  place-self: end;
                }
                
                .place-self-center {
                  place-self: center;
                }
                
                .place-self-stretch {
                  place-self: stretch;
                }
                
                .items-start {
                  align-items: flex-start;
                }
                
                .items-end {
                  align-items: flex-end;
                }
                
                .items-center {
                  align-items: center;
                }
                
                .items-baseline {
                  align-items: baseline;
                }
                
                .items-stretch {
                  align-items: stretch;
                }
                
                .content-center {
                  align-content: center;
                }
                
                .content-start {
                  align-content: flex-start;
                }
                
                .content-end {
                  align-content: flex-end;
                }
                
                .content-between {
                  align-content: space-between;
                }
                
                .content-around {
                  align-content: space-around;
                }
                
                .content-evenly {
                  align-content: space-evenly;
                }
                
                .self-auto {
                  align-self: auto;
                }
                
                .self-start {
                  align-self: flex-start;
                }
                
                .self-end {
                  align-self: flex-end;
                }
                
                .self-center {
                  align-self: center;
                }
                
                .self-stretch {
                  align-self: stretch;
                }
                
                .justify-items-auto {
                  justify-items: auto;
                }
                
                .justify-items-start {
                  justify-items: start;
                }
                
                .justify-items-end {
                  justify-items: end;
                }
                
                .justify-items-center {
                  justify-items: center;
                }
                
                .justify-items-stretch {
                  justify-items: stretch;
                }
                
                .justify-start {
                  justify-content: flex-start;
                }
                
                .justify-end {
                  justify-content: flex-end;
                }
                
                .justify-center {
                  justify-content: center;
                }
                
                .justify-between {
                  justify-content: space-between;
                }
                
                .justify-around {
                  justify-content: space-around;
                }
                
                .justify-evenly {
                  justify-content: space-evenly;
                }
                
                .justify-self-auto {
                  justify-self: auto;
                }
                
                .justify-self-start {
                  justify-self: start;
                }
                
                .justify-self-end {
                  justify-self: end;
                }
                
                .justify-self-center {
                  justify-self: center;
                }
                
                .justify-self-stretch {
                  justify-self: stretch;
                }
                
                .flex-1 {
                  flex: 1 1 0%;
                }
                
                .flex-auto {
                  flex: 1 1 auto;
                }
                
                .flex-initial {
                  flex: 0 1 auto;
                }
                
                .flex-none {
                  flex: none;
                }
                
                .flex-grow-0 {
                  flex-grow: 0;
                }
                
                .flex-grow {
                  flex-grow: 1;
                }
                
                .flex-shrink-0 {
                  flex-shrink: 0;
                }
                
                .flex-shrink {
                  flex-shrink: 1;
                }
                
                .order-1 {
                  order: 1;
                }
                
                .order-2 {
                  order: 2;
                }
                
                .order-3 {
                  order: 3;
                }
                
                .order-4 {
                  order: 4;
                }
                
                .order-5 {
                  order: 5;
                }
                
                .order-6 {
                  order: 6;
                }
                
                .order-7 {
                  order: 7;
                }
                
                .order-8 {
                  order: 8;
                }
                
                .order-9 {
                  order: 9;
                }
                
                .order-10 {
                  order: 10;
                }
                
                .order-11 {
                  order: 11;
                }
                
                .order-12 {
                  order: 12;
                }
                
                .order-first {
                  order: -9999;
                }
                
                .order-last {
                  order: 9999;
                }
                
                .order-none {
                  order: 0;
                }
                
                .float-right {
                  float: right;
                }
                
                .float-left {
                  float: left;
                }
                
                .float-none {
                  float: none;
                }
                
                .clearfix:after {
                  content: "";
                  display: table;
                  clear: both;
                }
                
                .clear-left {
                  clear: left;
                }
                
                .clear-right {
                  clear: right;
                }
                
                .clear-both {
                  clear: both;
                }
                
                .clear-none {
                  clear: none;
                }
                
                .font-sans {
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                }
                
                .font-serif {
                  font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                }
                
                .font-mono {
                  font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                
                .font-hairline {
                  font-weight: 100;
                }
                
                .font-thin {
                  font-weight: 200;
                }
                
                .font-light {
                  font-weight: 300;
                }
                
                .font-normal {
                  font-weight: 400;
                }
                
                .font-medium {
                  font-weight: 500;
                }
                
                .font-semibold {
                  font-weight: 600;
                }
                
                .font-bold {
                  font-weight: 700;
                }
                
                .font-extrabold {
                  font-weight: 800;
                }
                
                .font-black {
                  font-weight: 900;
                }
                
                .h-0 {
                  height: 0;
                }
                
                .h-1 {
                  height: 0.25rem;
                }
                
                .h-2 {
                  height: 0.5rem;
                }
                
                .h-3 {
                  height: 0.75rem;
                }
                
                .h-4 {
                  height: 1rem;
                }
                
                .h-5 {
                  height: 1.25rem;
                }
                
                .h-6 {
                  height: 1.5rem;
                }
                
                .h-8 {
                  height: 2rem;
                }
                
                .h-10 {
                  height: 2.5rem;
                }
                
                .h-12 {
                  height: 3rem;
                }
                
                .h-16 {
                  height: 4rem;
                }
                
                .h-20 {
                  height: 5rem;
                }
                
                .h-24 {
                  height: 6rem;
                }
                
                .h-32 {
                  height: 8rem;
                }
                
                .h-40 {
                  height: 10rem;
                }
                
                .h-48 {
                  height: 12rem;
                }
                
                .h-56 {
                  height: 14rem;
                }
                
                .h-64 {
                  height: 16rem;
                }
                
                .h-auto {
                  height: auto;
                }
                
                .h-px {
                  height: 1px;
                }
                
                .h-full {
                  height: 100%;
                }
                
                .h-screen {
                  height: 100vh;
                }
                
                .text-xs {
                  font-size: 0.75rem;
                }
                
                .text-sm {
                  font-size: 0.875rem;
                }
                
                .text-base {
                  font-size: 1rem;
                }
                
                .text-lg {
                  font-size: 1.125rem;
                }
                
                .text-xl {
                  font-size: 1.25rem;
                }
                
                .text-2xl {
                  font-size: 1.5rem;
                }
                
                .text-3xl {
                  font-size: 1.875rem;
                }
                
                .text-4xl {
                  font-size: 2.25rem;
                }
                
                .text-5xl {
                  font-size: 3rem;
                }
                
                .text-6xl {
                  font-size: 4rem;
                }
                
                .leading-3 {
                  line-height: .75rem;
                }
                
                .leading-4 {
                  line-height: 1rem;
                }
                
                .leading-5 {
                  line-height: 1.25rem;
                }
                
                .leading-6 {
                  line-height: 1.5rem;
                }
                
                .leading-7 {
                  line-height: 1.75rem;
                }
                
                .leading-8 {
                  line-height: 2rem;
                }
                
                .leading-9 {
                  line-height: 2.25rem;
                }
                
                .leading-10 {
                  line-height: 2.5rem;
                }
                
                .leading-none {
                  line-height: 1;
                }
                
                .leading-tight {
                  line-height: 1.25;
                }
                
                .leading-snug {
                  line-height: 1.375;
                }
                
                .leading-normal {
                  line-height: 1.5;
                }
                
                .leading-relaxed {
                  line-height: 1.625;
                }
                
                .leading-loose {
                  line-height: 2;
                }
                
                .list-inside {
                  list-style-position: inside;
                }
                
                .list-outside {
                  list-style-position: outside;
                }
                
                .list-none {
                  list-style-type: none;
                }
                
                .list-disc {
                  list-style-type: disc;
                }
                
                .list-decimal {
                  list-style-type: decimal;
                }
                
                .m-0 {
                  margin: 0;
                }
                
                .m-1 {
                  margin: 0.25rem;
                }
                
                .m-2 {
                  margin: 0.5rem;
                }
                
                .m-3 {
                  margin: 0.75rem;
                }
                
                .m-4 {
                  margin: 1rem;
                }
                
                .m-5 {
                  margin: 1.25rem;
                }
                
                .m-6 {
                  margin: 1.5rem;
                }
                
                .m-8 {
                  margin: 2rem;
                }
                
                .m-10 {
                  margin: 2.5rem;
                }
                
                .m-12 {
                  margin: 3rem;
                }
                
                .m-16 {
                  margin: 4rem;
                }
                
                .m-20 {
                  margin: 5rem;
                }
                
                .m-24 {
                  margin: 6rem;
                }
                
                .m-32 {
                  margin: 8rem;
                }
                
                .m-40 {
                  margin: 10rem;
                }
                
                .m-48 {
                  margin: 12rem;
                }
                
                .m-56 {
                  margin: 14rem;
                }
                
                .m-64 {
                  margin: 16rem;
                }
                
                .m-auto {
                  margin: auto;
                }
                
                .m-px {
                  margin: 1px;
                }
                
                .-m-1 {
                  margin: -0.25rem;
                }
                
                .-m-2 {
                  margin: -0.5rem;
                }
                
                .-m-3 {
                  margin: -0.75rem;
                }
                
                .-m-4 {
                  margin: -1rem;
                }
                
                .-m-5 {
                  margin: -1.25rem;
                }
                
                .-m-6 {
                  margin: -1.5rem;
                }
                
                .-m-8 {
                  margin: -2rem;
                }
                
                .-m-10 {
                  margin: -2.5rem;
                }
                
                .-m-12 {
                  margin: -3rem;
                }
                
                .-m-16 {
                  margin: -4rem;
                }
                
                .-m-20 {
                  margin: -5rem;
                }
                
                .-m-24 {
                  margin: -6rem;
                }
                
                .-m-32 {
                  margin: -8rem;
                }
                
                .-m-40 {
                  margin: -10rem;
                }
                
                .-m-48 {
                  margin: -12rem;
                }
                
                .-m-56 {
                  margin: -14rem;
                }
                
                .-m-64 {
                  margin: -16rem;
                }
                
                .-m-px {
                  margin: -1px;
                }
                
                .my-0 {
                  margin-top: 0;
                  margin-bottom: 0;
                }
                
                .mx-0 {
                  margin-left: 0;
                  margin-right: 0;
                }
                
                .my-1 {
                  margin-top: 0.25rem;
                  margin-bottom: 0.25rem;
                }
                
                .mx-1 {
                  margin-left: 0.25rem;
                  margin-right: 0.25rem;
                }
                
                .my-2 {
                  margin-top: 0.5rem;
                  margin-bottom: 0.5rem;
                }
                
                .mx-2 {
                  margin-left: 0.5rem;
                  margin-right: 0.5rem;
                }
                
                .my-3 {
                  margin-top: 0.75rem;
                  margin-bottom: 0.75rem;
                }
                
                .mx-3 {
                  margin-left: 0.75rem;
                  margin-right: 0.75rem;
                }
                
                .my-4 {
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                }
                
                .mx-4 {
                  margin-left: 1rem;
                  margin-right: 1rem;
                }
                
                .my-5 {
                  margin-top: 1.25rem;
                  margin-bottom: 1.25rem;
                }
                
                .mx-5 {
                  margin-left: 1.25rem;
                  margin-right: 1.25rem;
                }
                
                .my-6 {
                  margin-top: 1.5rem;
                  margin-bottom: 1.5rem;
                }
                
                .mx-6 {
                  margin-left: 1.5rem;
                  margin-right: 1.5rem;
                }
                
                .my-8 {
                  margin-top: 2rem;
                  margin-bottom: 2rem;
                }
                
                .mx-8 {
                  margin-left: 2rem;
                  margin-right: 2rem;
                }
                
                .my-10 {
                  margin-top: 2.5rem;
                  margin-bottom: 2.5rem;
                }
                
                .mx-10 {
                  margin-left: 2.5rem;
                  margin-right: 2.5rem;
                }
                
                .my-12 {
                  margin-top: 3rem;
                  margin-bottom: 3rem;
                }
                
                .mx-12 {
                  margin-left: 3rem;
                  margin-right: 3rem;
                }
                
                .my-16 {
                  margin-top: 4rem;
                  margin-bottom: 4rem;
                }
                
                .mx-16 {
                  margin-left: 4rem;
                  margin-right: 4rem;
                }
                
                .my-20 {
                  margin-top: 5rem;
                  margin-bottom: 5rem;
                }
                
                .mx-20 {
                  margin-left: 5rem;
                  margin-right: 5rem;
                }
                
                .my-24 {
                  margin-top: 6rem;
                  margin-bottom: 6rem;
                }
                
                .mx-24 {
                  margin-left: 6rem;
                  margin-right: 6rem;
                }
                
                .my-32 {
                  margin-top: 8rem;
                  margin-bottom: 8rem;
                }
                
                .mx-32 {
                  margin-left: 8rem;
                  margin-right: 8rem;
                }
                
                .my-40 {
                  margin-top: 10rem;
                  margin-bottom: 10rem;
                }
                
                .mx-40 {
                  margin-left: 10rem;
                  margin-right: 10rem;
                }
                
                .my-48 {
                  margin-top: 12rem;
                  margin-bottom: 12rem;
                }
                
                .mx-48 {
                  margin-left: 12rem;
                  margin-right: 12rem;
                }
                
                .my-56 {
                  margin-top: 14rem;
                  margin-bottom: 14rem;
                }
                
                .mx-56 {
                  margin-left: 14rem;
                  margin-right: 14rem;
                }
                
                .my-64 {
                  margin-top: 16rem;
                  margin-bottom: 16rem;
                }
                
                .mx-64 {
                  margin-left: 16rem;
                  margin-right: 16rem;
                }
                
                .my-auto {
                  margin-top: auto;
                  margin-bottom: auto;
                }
                
                .mx-auto {
                  margin-left: auto;
                  margin-right: auto;
                }
                
                .my-px {
                  margin-top: 1px;
                  margin-bottom: 1px;
                }
                
                .mx-px {
                  margin-left: 1px;
                  margin-right: 1px;
                }
                
                .-my-1 {
                  margin-top: -0.25rem;
                  margin-bottom: -0.25rem;
                }
                
                .-mx-1 {
                  margin-left: -0.25rem;
                  margin-right: -0.25rem;
                }
                
                .-my-2 {
                  margin-top: -0.5rem;
                  margin-bottom: -0.5rem;
                }
                
                .-mx-2 {
                  margin-left: -0.5rem;
                  margin-right: -0.5rem;
                }
                
                .-my-3 {
                  margin-top: -0.75rem;
                  margin-bottom: -0.75rem;
                }
                
                .-mx-3 {
                  margin-left: -0.75rem;
                  margin-right: -0.75rem;
                }
                
                .-my-4 {
                  margin-top: -1rem;
                  margin-bottom: -1rem;
                }
                
                .-mx-4 {
                  margin-left: -1rem;
                  margin-right: -1rem;
                }
                
                .-my-5 {
                  margin-top: -1.25rem;
                  margin-bottom: -1.25rem;
                }
                
                .-mx-5 {
                  margin-left: -1.25rem;
                  margin-right: -1.25rem;
                }
                
                .-my-6 {
                  margin-top: -1.5rem;
                  margin-bottom: -1.5rem;
                }
                
                .-mx-6 {
                  margin-left: -1.5rem;
                  margin-right: -1.5rem;
                }
                
                .-my-8 {
                  margin-top: -2rem;
                  margin-bottom: -2rem;
                }
                
                .-mx-8 {
                  margin-left: -2rem;
                  margin-right: -2rem;
                }
                
                .-my-10 {
                  margin-top: -2.5rem;
                  margin-bottom: -2.5rem;
                }
                
                .-mx-10 {
                  margin-left: -2.5rem;
                  margin-right: -2.5rem;
                }
                
                .-my-12 {
                  margin-top: -3rem;
                  margin-bottom: -3rem;
                }
                
                .-mx-12 {
                  margin-left: -3rem;
                  margin-right: -3rem;
                }
                
                .-my-16 {
                  margin-top: -4rem;
                  margin-bottom: -4rem;
                }
                
                .-mx-16 {
                  margin-left: -4rem;
                  margin-right: -4rem;
                }
                
                .-my-20 {
                  margin-top: -5rem;
                  margin-bottom: -5rem;
                }
                
                .-mx-20 {
                  margin-left: -5rem;
                  margin-right: -5rem;
                }
                
                .-my-24 {
                  margin-top: -6rem;
                  margin-bottom: -6rem;
                }
                
                .-mx-24 {
                  margin-left: -6rem;
                  margin-right: -6rem;
                }
                
                .-my-32 {
                  margin-top: -8rem;
                  margin-bottom: -8rem;
                }
                
                .-mx-32 {
                  margin-left: -8rem;
                  margin-right: -8rem;
                }
                
                .-my-40 {
                  margin-top: -10rem;
                  margin-bottom: -10rem;
                }
                
                .-mx-40 {
                  margin-left: -10rem;
                  margin-right: -10rem;
                }
                
                .-my-48 {
                  margin-top: -12rem;
                  margin-bottom: -12rem;
                }
                
                .-mx-48 {
                  margin-left: -12rem;
                  margin-right: -12rem;
                }
                
                .-my-56 {
                  margin-top: -14rem;
                  margin-bottom: -14rem;
                }
                
                .-mx-56 {
                  margin-left: -14rem;
                  margin-right: -14rem;
                }
                
                .-my-64 {
                  margin-top: -16rem;
                  margin-bottom: -16rem;
                }
                
                .-mx-64 {
                  margin-left: -16rem;
                  margin-right: -16rem;
                }
                
                .-my-px {
                  margin-top: -1px;
                  margin-bottom: -1px;
                }
                
                .-mx-px {
                  margin-left: -1px;
                  margin-right: -1px;
                }
                
                .mt-0 {
                  margin-top: 0;
                }
                
                .mr-0 {
                  margin-right: 0;
                }
                
                .mb-0 {
                  margin-bottom: 0;
                }
                
                .ml-0 {
                  margin-left: 0;
                }
                
                .mt-1 {
                  margin-top: 0.25rem;
                }
                
                .mr-1 {
                  margin-right: 0.25rem;
                }
                
                .mb-1 {
                  margin-bottom: 0.25rem;
                }
                
                .ml-1 {
                  margin-left: 0.25rem;
                }
                
                .mt-2 {
                  margin-top: 0.5rem;
                }
                
                .mr-2 {
                  margin-right: 0.5rem;
                }
                
                .mb-2 {
                  margin-bottom: 0.5rem;
                }
                
                .ml-2 {
                  margin-left: 0.5rem;
                }
                
                .mt-3 {
                  margin-top: 0.75rem;
                }
                
                .mr-3 {
                  margin-right: 0.75rem;
                }
                
                .mb-3 {
                  margin-bottom: 0.75rem;
                }
                
                .ml-3 {
                  margin-left: 0.75rem;
                }
                
                .mt-4 {
                  margin-top: 1rem;
                }
                
                .mr-4 {
                  margin-right: 1rem;
                }
                
                .mb-4 {
                  margin-bottom: 1rem;
                }
                
                .ml-4 {
                  margin-left: 1rem;
                }
                
                .mt-5 {
                  margin-top: 1.25rem;
                }
                
                .mr-5 {
                  margin-right: 1.25rem;
                }
                
                .mb-5 {
                  margin-bottom: 1.25rem;
                }
                
                .ml-5 {
                  margin-left: 1.25rem;
                }
                
                .mt-6 {
                  margin-top: 1.5rem;
                }
                
                .mr-6 {
                  margin-right: 1.5rem;
                }
                
                .mb-6 {
                  margin-bottom: 1.5rem;
                }
                
                .ml-6 {
                  margin-left: 1.5rem;
                }
                
                .mt-8 {
                  margin-top: 2rem;
                }
                
                .mr-8 {
                  margin-right: 2rem;
                }
                
                .mb-8 {
                  margin-bottom: 2rem;
                }
                
                .ml-8 {
                  margin-left: 2rem;
                }
                
                .mt-10 {
                  margin-top: 2.5rem;
                }
                
                .mr-10 {
                  margin-right: 2.5rem;
                }
                
                .mb-10 {
                  margin-bottom: 2.5rem;
                }
                
                .ml-10 {
                  margin-left: 2.5rem;
                }
                
                .mt-12 {
                  margin-top: 3rem;
                }
                
                .mr-12 {
                  margin-right: 3rem;
                }
                
                .mb-12 {
                  margin-bottom: 3rem;
                }
                
                .ml-12 {
                  margin-left: 3rem;
                }
                
                .mt-16 {
                  margin-top: 4rem;
                }
                
                .mr-16 {
                  margin-right: 4rem;
                }
                
                .mb-16 {
                  margin-bottom: 4rem;
                }
                
                .ml-16 {
                  margin-left: 4rem;
                }
                
                .mt-20 {
                  margin-top: 5rem;
                }
                
                .mr-20 {
                  margin-right: 5rem;
                }
                
                .mb-20 {
                  margin-bottom: 5rem;
                }
                
                .ml-20 {
                  margin-left: 5rem;
                }
                
                .mt-24 {
                  margin-top: 6rem;
                }
                
                .mr-24 {
                  margin-right: 6rem;
                }
                
                .mb-24 {
                  margin-bottom: 6rem;
                }
                
                .ml-24 {
                  margin-left: 6rem;
                }
                
                .mt-32 {
                  margin-top: 8rem;
                }
                
                .mr-32 {
                  margin-right: 8rem;
                }
                
                .mb-32 {
                  margin-bottom: 8rem;
                }
                
                .ml-32 {
                  margin-left: 8rem;
                }
                
                .mt-40 {
                  margin-top: 10rem;
                }
                
                .mr-40 {
                  margin-right: 10rem;
                }
                
                .mb-40 {
                  margin-bottom: 10rem;
                }
                
                .ml-40 {
                  margin-left: 10rem;
                }
                
                .mt-48 {
                  margin-top: 12rem;
                }
                
                .mr-48 {
                  margin-right: 12rem;
                }
                
                .mb-48 {
                  margin-bottom: 12rem;
                }
                
                .ml-48 {
                  margin-left: 12rem;
                }
                
                .mt-56 {
                  margin-top: 14rem;
                }
                
                .mr-56 {
                  margin-right: 14rem;
                }
                
                .mb-56 {
                  margin-bottom: 14rem;
                }
                
                .ml-56 {
                  margin-left: 14rem;
                }
                
                .mt-64 {
                  margin-top: 16rem;
                }
                
                .mr-64 {
                  margin-right: 16rem;
                }
                
                .mb-64 {
                  margin-bottom: 16rem;
                }
                
                .ml-64 {
                  margin-left: 16rem;
                }
                
                .mt-auto {
                  margin-top: auto;
                }
                
                .mr-auto {
                  margin-right: auto;
                }
                
                .mb-auto {
                  margin-bottom: auto;
                }
                
                .ml-auto {
                  margin-left: auto;
                }
                
                .mt-px {
                  margin-top: 1px;
                }
                
                .mr-px {
                  margin-right: 1px;
                }
                
                .mb-px {
                  margin-bottom: 1px;
                }
                
                .ml-px {
                  margin-left: 1px;
                }
                
                .-mt-1 {
                  margin-top: -0.25rem;
                }
                
                .-mr-1 {
                  margin-right: -0.25rem;
                }
                
                .-mb-1 {
                  margin-bottom: -0.25rem;
                }
                
                .-ml-1 {
                  margin-left: -0.25rem;
                }
                
                .-mt-2 {
                  margin-top: -0.5rem;
                }
                
                .-mr-2 {
                  margin-right: -0.5rem;
                }
                
                .-mb-2 {
                  margin-bottom: -0.5rem;
                }
                
                .-ml-2 {
                  margin-left: -0.5rem;
                }
                
                .-mt-3 {
                  margin-top: -0.75rem;
                }
                
                .-mr-3 {
                  margin-right: -0.75rem;
                }
                
                .-mb-3 {
                  margin-bottom: -0.75rem;
                }
                
                .-ml-3 {
                  margin-left: -0.75rem;
                }
                
                .-mt-4 {
                  margin-top: -1rem;
                }
                
                .-mr-4 {
                  margin-right: -1rem;
                }
                
                .-mb-4 {
                  margin-bottom: -1rem;
                }
                
                .-ml-4 {
                  margin-left: -1rem;
                }
                
                .-mt-5 {
                  margin-top: -1.25rem;
                }
                
                .-mr-5 {
                  margin-right: -1.25rem;
                }
                
                .-mb-5 {
                  margin-bottom: -1.25rem;
                }
                
                .-ml-5 {
                  margin-left: -1.25rem;
                }
                
                .-mt-6 {
                  margin-top: -1.5rem;
                }
                
                .-mr-6 {
                  margin-right: -1.5rem;
                }
                
                .-mb-6 {
                  margin-bottom: -1.5rem;
                }
                
                .-ml-6 {
                  margin-left: -1.5rem;
                }
                
                .-mt-8 {
                  margin-top: -2rem;
                }
                
                .-mr-8 {
                  margin-right: -2rem;
                }
                
                .-mb-8 {
                  margin-bottom: -2rem;
                }
                
                .-ml-8 {
                  margin-left: -2rem;
                }
                
                .-mt-10 {
                  margin-top: -2.5rem;
                }
                
                .-mr-10 {
                  margin-right: -2.5rem;
                }
                
                .-mb-10 {
                  margin-bottom: -2.5rem;
                }
                
                .-ml-10 {
                  margin-left: -2.5rem;
                }
                
                .-mt-12 {
                  margin-top: -3rem;
                }
                
                .-mr-12 {
                  margin-right: -3rem;
                }
                
                .-mb-12 {
                  margin-bottom: -3rem;
                }
                
                .-ml-12 {
                  margin-left: -3rem;
                }
                
                .-mt-16 {
                  margin-top: -4rem;
                }
                
                .-mr-16 {
                  margin-right: -4rem;
                }
                
                .-mb-16 {
                  margin-bottom: -4rem;
                }
                
                .-ml-16 {
                  margin-left: -4rem;
                }
                
                .-mt-20 {
                  margin-top: -5rem;
                }
                
                .-mr-20 {
                  margin-right: -5rem;
                }
                
                .-mb-20 {
                  margin-bottom: -5rem;
                }
                
                .-ml-20 {
                  margin-left: -5rem;
                }
                
                .-mt-24 {
                  margin-top: -6rem;
                }
                
                .-mr-24 {
                  margin-right: -6rem;
                }
                
                .-mb-24 {
                  margin-bottom: -6rem;
                }
                
                .-ml-24 {
                  margin-left: -6rem;
                }
                
                .-mt-32 {
                  margin-top: -8rem;
                }
                
                .-mr-32 {
                  margin-right: -8rem;
                }
                
                .-mb-32 {
                  margin-bottom: -8rem;
                }
                
                .-ml-32 {
                  margin-left: -8rem;
                }
                
                .-mt-40 {
                  margin-top: -10rem;
                }
                
                .-mr-40 {
                  margin-right: -10rem;
                }
                
                .-mb-40 {
                  margin-bottom: -10rem;
                }
                
                .-ml-40 {
                  margin-left: -10rem;
                }
                
                .-mt-48 {
                  margin-top: -12rem;
                }
                
                .-mr-48 {
                  margin-right: -12rem;
                }
                
                .-mb-48 {
                  margin-bottom: -12rem;
                }
                
                .-ml-48 {
                  margin-left: -12rem;
                }
                
                .-mt-56 {
                  margin-top: -14rem;
                }
                
                .-mr-56 {
                  margin-right: -14rem;
                }
                
                .-mb-56 {
                  margin-bottom: -14rem;
                }
                
                .-ml-56 {
                  margin-left: -14rem;
                }
                
                .-mt-64 {
                  margin-top: -16rem;
                }
                
                .-mr-64 {
                  margin-right: -16rem;
                }
                
                .-mb-64 {
                  margin-bottom: -16rem;
                }
                
                .-ml-64 {
                  margin-left: -16rem;
                }
                
                .-mt-px {
                  margin-top: -1px;
                }
                
                .-mr-px {
                  margin-right: -1px;
                }
                
                .-mb-px {
                  margin-bottom: -1px;
                }
                
                .-ml-px {
                  margin-left: -1px;
                }
                
                .max-h-full {
                  max-height: 100%;
                }
                
                .max-h-screen {
                  max-height: 100vh;
                }
                
                .max-w-none {
                  max-width: none;
                }
                
                .max-w-xs {
                  max-width: 20rem;
                }
                
                .max-w-sm {
                  max-width: 24rem;
                }
                
                .max-w-md {
                  max-width: 28rem;
                }
                
                .max-w-lg {
                  max-width: 32rem;
                }
                
                .max-w-xl {
                  max-width: 36rem;
                }
                
                .max-w-2xl {
                  max-width: 42rem;
                }
                
                .max-w-3xl {
                  max-width: 48rem;
                }
                
                .max-w-4xl {
                  max-width: 56rem;
                }
                
                .max-w-5xl {
                  max-width: 64rem;
                }
                
                .max-w-6xl {
                  max-width: 72rem;
                }
                
                .max-w-full {
                  max-width: 100%;
                }
                
                .max-w-screen-sm {
                  max-width: 640px;
                }
                
                .max-w-screen-md {
                  max-width: 768px;
                }
                
                .max-w-screen-lg {
                  max-width: 1024px;
                }
                
                .max-w-screen-xl {
                  max-width: 1280px;
                }
                
                .min-h-0 {
                  min-height: 0;
                }
                
                .min-h-full {
                  min-height: 100%;
                }
                
                .min-h-screen {
                  min-height: 100vh;
                }
                
                .min-w-0 {
                  min-width: 0;
                }
                
                .min-w-full {
                  min-width: 100%;
                }
                
                .object-contain {
                  object-fit: contain;
                }
                
                .object-cover {
                  object-fit: cover;
                }
                
                .object-fill {
                  object-fit: fill;
                }
                
                .object-none {
                  object-fit: none;
                }
                
                .object-scale-down {
                  object-fit: scale-down;
                }
                
                .object-bottom {
                  object-position: bottom;
                }
                
                .object-center {
                  object-position: center;
                }
                
                .object-left {
                  object-position: left;
                }
                
                .object-left-bottom {
                  object-position: left bottom;
                }
                
                .object-left-top {
                  object-position: left top;
                }
                
                .object-right {
                  object-position: right;
                }
                
                .object-right-bottom {
                  object-position: right bottom;
                }
                
                .object-right-top {
                  object-position: right top;
                }
                
                .object-top {
                  object-position: top;
                }
                
                .opacity-0 {
                  opacity: 0;
                }
                
                .opacity-25 {
                  opacity: 0.25;
                }
                
                .opacity-50 {
                  opacity: 0.5;
                }
                
                .opacity-75 {
                  opacity: 0.75;
                }
                
                .opacity-100 {
                  opacity: 1;
                }
                
                .outline-none {
                  outline: 2px solid transparent;
                  outline-offset: 2px;
                }
                
                .outline-white {
                  outline: 2px dotted white;
                  outline-offset: 2px;
                }
                
                .outline-black {
                  outline: 2px dotted black;
                  outline-offset: 2px;
                }
                
                .overflow-auto {
                  overflow: auto;
                }
                
                .overflow-hidden {
                  overflow: hidden;
                }
                
                .overflow-visible {
                  overflow: visible;
                }
                
                .overflow-scroll {
                  overflow: scroll;
                }
                
                .overflow-x-auto {
                  overflow-x: auto;
                }
                
                .overflow-y-auto {
                  overflow-y: auto;
                }
                
                .overflow-x-hidden {
                  overflow-x: hidden;
                }
                
                .overflow-y-hidden {
                  overflow-y: hidden;
                }
                
                .overflow-x-visible {
                  overflow-x: visible;
                }
                
                .overflow-y-visible {
                  overflow-y: visible;
                }
                
                .overflow-x-scroll {
                  overflow-x: scroll;
                }
                
                .overflow-y-scroll {
                  overflow-y: scroll;
                }
                
                .scrolling-touch {
                  -webkit-overflow-scrolling: touch;
                }
                
                .scrolling-auto {
                  -webkit-overflow-scrolling: auto;
                }
                
                .overscroll-auto {
                  -ms-scroll-chaining: chained;
                      overscroll-behavior: auto;
                }
                
                .overscroll-contain {
                  -ms-scroll-chaining: none;
                      overscroll-behavior: contain;
                }
                
                .overscroll-none {
                  -ms-scroll-chaining: none;
                      overscroll-behavior: none;
                }
                
                .overscroll-y-auto {
                  overscroll-behavior-y: auto;
                }
                
                .overscroll-y-contain {
                  overscroll-behavior-y: contain;
                }
                
                .overscroll-y-none {
                  overscroll-behavior-y: none;
                }
                
                .overscroll-x-auto {
                  overscroll-behavior-x: auto;
                }
                
                .overscroll-x-contain {
                  overscroll-behavior-x: contain;
                }
                
                .overscroll-x-none {
                  overscroll-behavior-x: none;
                }
                
                .p-0 {
                  padding: 0;
                }
                
                .p-1 {
                  padding: 0.25rem;
                }
                
                .p-2 {
                  padding: 0.5rem;
                }
                
                .p-3 {
                  padding: 0.75rem;
                }
                
                .p-4 {
                  padding: 1rem;
                }
                
                .p-5 {
                  padding: 1.25rem;
                }
                
                .p-6 {
                  padding: 1.5rem;
                }
                
                .p-8 {
                  padding: 2rem;
                }
                
                .p-10 {
                  padding: 2.5rem;
                }
                
                .p-12 {
                  padding: 3rem;
                }
                
                .p-16 {
                  padding: 4rem;
                }
                
                .p-20 {
                  padding: 5rem;
                }
                
                .p-24 {
                  padding: 6rem;
                }
                
                .p-32 {
                  padding: 8rem;
                }
                
                .p-40 {
                  padding: 10rem;
                }
                
                .p-48 {
                  padding: 12rem;
                }
                
                .p-56 {
                  padding: 14rem;
                }
                
                .p-64 {
                  padding: 16rem;
                }
                
                .p-px {
                  padding: 1px;
                }
                
                .py-0 {
                  padding-top: 0;
                  padding-bottom: 0;
                }
                
                .px-0 {
                  padding-left: 0;
                  padding-right: 0;
                }
                
                .py-1 {
                  padding-top: 0.25rem;
                  padding-bottom: 0.25rem;
                }
                
                .px-1 {
                  padding-left: 0.25rem;
                  padding-right: 0.25rem;
                }
                
                .py-2 {
                  padding-top: 0.5rem;
                  padding-bottom: 0.5rem;
                }
                
                .px-2 {
                  padding-left: 0.5rem;
                  padding-right: 0.5rem;
                }
                
                .py-3 {
                  padding-top: 0.75rem;
                  padding-bottom: 0.75rem;
                }
                
                .px-3 {
                  padding-left: 0.75rem;
                  padding-right: 0.75rem;
                }
                
                .py-4 {
                  padding-top: 1rem;
                  padding-bottom: 1rem;
                }
                
                .px-4 {
                  padding-left: 1rem;
                  padding-right: 1rem;
                }
                
                .py-5 {
                  padding-top: 1.25rem;
                  padding-bottom: 1.25rem;
                }
                
                .px-5 {
                  padding-left: 1.25rem;
                  padding-right: 1.25rem;
                }
                
                .py-6 {
                  padding-top: 1.5rem;
                  padding-bottom: 1.5rem;
                }
                
                .px-6 {
                  padding-left: 1.5rem;
                  padding-right: 1.5rem;
                }
                
                .py-8 {
                  padding-top: 2rem;
                  padding-bottom: 2rem;
                }
                
                .px-8 {
                  padding-left: 2rem;
                  padding-right: 2rem;
                }
                
                .py-10 {
                  padding-top: 2.5rem;
                  padding-bottom: 2.5rem;
                }
                
                .px-10 {
                  padding-left: 2.5rem;
                  padding-right: 2.5rem;
                }
                
                .py-12 {
                  padding-top: 3rem;
                  padding-bottom: 3rem;
                }
                
                .px-12 {
                  padding-left: 3rem;
                  padding-right: 3rem;
                }
                
                .py-16 {
                  padding-top: 4rem;
                  padding-bottom: 4rem;
                }
                
                .px-16 {
                  padding-left: 4rem;
                  padding-right: 4rem;
                }
                
                .py-20 {
                  padding-top: 5rem;
                  padding-bottom: 5rem;
                }
                
                .px-20 {
                  padding-left: 5rem;
                  padding-right: 5rem;
                }
                
                .py-24 {
                  padding-top: 6rem;
                  padding-bottom: 6rem;
                }
                
                .px-24 {
                  padding-left: 6rem;
                  padding-right: 6rem;
                }
                
                .py-32 {
                  padding-top: 8rem;
                  padding-bottom: 8rem;
                }
                
                .px-32 {
                  padding-left: 8rem;
                  padding-right: 8rem;
                }
                
                .py-40 {
                  padding-top: 10rem;
                  padding-bottom: 10rem;
                }
                
                .px-40 {
                  padding-left: 10rem;
                  padding-right: 10rem;
                }
                
                .py-48 {
                  padding-top: 12rem;
                  padding-bottom: 12rem;
                }
                
                .px-48 {
                  padding-left: 12rem;
                  padding-right: 12rem;
                }
                
                .py-56 {
                  padding-top: 14rem;
                  padding-bottom: 14rem;
                }
                
                .px-56 {
                  padding-left: 14rem;
                  padding-right: 14rem;
                }
                
                .py-64 {
                  padding-top: 16rem;
                  padding-bottom: 16rem;
                }
                
                .px-64 {
                  padding-left: 16rem;
                  padding-right: 16rem;
                }
                
                .py-px {
                  padding-top: 1px;
                  padding-bottom: 1px;
                }
                
                .px-px {
                  padding-left: 1px;
                  padding-right: 1px;
                }
                
                .pt-0 {
                  padding-top: 0;
                }
                
                .pr-0 {
                  padding-right: 0;
                }
                
                .pb-0 {
                  padding-bottom: 0;
                }
                
                .pl-0 {
                  padding-left: 0;
                }
                
                .pt-1 {
                  padding-top: 0.25rem;
                }
                
                .pr-1 {
                  padding-right: 0.25rem;
                }
                
                .pb-1 {
                  padding-bottom: 0.25rem;
                }
                
                .pl-1 {
                  padding-left: 0.25rem;
                }
                
                .pt-2 {
                  padding-top: 0.5rem;
                }
                
                .pr-2 {
                  padding-right: 0.5rem;
                }
                
                .pb-2 {
                  padding-bottom: 0.5rem;
                }
                
                .pl-2 {
                  padding-left: 0.5rem;
                }
                
                .pt-3 {
                  padding-top: 0.75rem;
                }
                
                .pr-3 {
                  padding-right: 0.75rem;
                }
                
                .pb-3 {
                  padding-bottom: 0.75rem;
                }
                
                .pl-3 {
                  padding-left: 0.75rem;
                }
                
                .pt-4 {
                  padding-top: 1rem;
                }
                
                .pr-4 {
                  padding-right: 1rem;
                }
                
                .pb-4 {
                  padding-bottom: 1rem;
                }
                
                .pl-4 {
                  padding-left: 1rem;
                }
                
                .pt-5 {
                  padding-top: 1.25rem;
                }
                
                .pr-5 {
                  padding-right: 1.25rem;
                }
                
                .pb-5 {
                  padding-bottom: 1.25rem;
                }
                
                .pl-5 {
                  padding-left: 1.25rem;
                }
                
                .pt-6 {
                  padding-top: 1.5rem;
                }
                
                .pr-6 {
                  padding-right: 1.5rem;
                }
                
                .pb-6 {
                  padding-bottom: 1.5rem;
                }
                
                .pl-6 {
                  padding-left: 1.5rem;
                }
                
                .pt-8 {
                  padding-top: 2rem;
                }
                
                .pr-8 {
                  padding-right: 2rem;
                }
                
                .pb-8 {
                  padding-bottom: 2rem;
                }
                
                .pl-8 {
                  padding-left: 2rem;
                }
                
                .pt-10 {
                  padding-top: 2.5rem;
                }
                
                .pr-10 {
                  padding-right: 2.5rem;
                }
                
                .pb-10 {
                  padding-bottom: 2.5rem;
                }
                
                .pl-10 {
                  padding-left: 2.5rem;
                }
                
                .pt-12 {
                  padding-top: 3rem;
                }
                
                .pr-12 {
                  padding-right: 3rem;
                }
                
                .pb-12 {
                  padding-bottom: 3rem;
                }
                
                .pl-12 {
                  padding-left: 3rem;
                }
                
                .pt-16 {
                  padding-top: 4rem;
                }
                
                .pr-16 {
                  padding-right: 4rem;
                }
                
                .pb-16 {
                  padding-bottom: 4rem;
                }
                
                .pl-16 {
                  padding-left: 4rem;
                }
                
                .pt-20 {
                  padding-top: 5rem;
                }
                
                .pr-20 {
                  padding-right: 5rem;
                }
                
                .pb-20 {
                  padding-bottom: 5rem;
                }
                
                .pl-20 {
                  padding-left: 5rem;
                }
                
                .pt-24 {
                  padding-top: 6rem;
                }
                
                .pr-24 {
                  padding-right: 6rem;
                }
                
                .pb-24 {
                  padding-bottom: 6rem;
                }
                
                .pl-24 {
                  padding-left: 6rem;
                }
                
                .pt-32 {
                  padding-top: 8rem;
                }
                
                .pr-32 {
                  padding-right: 8rem;
                }
                
                .pb-32 {
                  padding-bottom: 8rem;
                }
                
                .pl-32 {
                  padding-left: 8rem;
                }
                
                .pt-40 {
                  padding-top: 10rem;
                }
                
                .pr-40 {
                  padding-right: 10rem;
                }
                
                .pb-40 {
                  padding-bottom: 10rem;
                }
                
                .pl-40 {
                  padding-left: 10rem;
                }
                
                .pt-48 {
                  padding-top: 12rem;
                }
                
                .pr-48 {
                  padding-right: 12rem;
                }
                
                .pb-48 {
                  padding-bottom: 12rem;
                }
                
                .pl-48 {
                  padding-left: 12rem;
                }
                
                .pt-56 {
                  padding-top: 14rem;
                }
                
                .pr-56 {
                  padding-right: 14rem;
                }
                
                .pb-56 {
                  padding-bottom: 14rem;
                }
                
                .pl-56 {
                  padding-left: 14rem;
                }
                
                .pt-64 {
                  padding-top: 16rem;
                }
                
                .pr-64 {
                  padding-right: 16rem;
                }
                
                .pb-64 {
                  padding-bottom: 16rem;
                }
                
                .pl-64 {
                  padding-left: 16rem;
                }
                
                .pt-px {
                  padding-top: 1px;
                }
                
                .pr-px {
                  padding-right: 1px;
                }
                
                .pb-px {
                  padding-bottom: 1px;
                }
                
                .pl-px {
                  padding-left: 1px;
                }
                
                .pointer-events-none {
                  pointer-events: none;
                }
                
                .pointer-events-auto {
                  pointer-events: auto;
                }
                
                .static {
                  position: static;
                }
                
                .fixed {
                  position: fixed;
                }
                
                .absolute {
                  position: absolute;
                }
                
                .relative {
                  position: relative;
                }
                
                .inset-0 {
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                }
                
                .inset-auto {
                  top: auto;
                  right: auto;
                  bottom: auto;
                  left: auto;
                }
                
                .inset-y-0 {
                  top: 0;
                  bottom: 0;
                }
                
                .inset-x-0 {
                  right: 0;
                  left: 0;
                }
                
                .inset-y-auto {
                  top: auto;
                  bottom: auto;
                }
                
                .inset-x-auto {
                  right: auto;
                  left: auto;
                }
                
                .top-0 {
                  top: 0;
                }
                
                .right-0 {
                  right: 0;
                }
                
                .bottom-0 {
                  bottom: 0;
                }
                
                .left-0 {
                  left: 0;
                }
                
                .top-auto {
                  top: auto;
                }
                
                .right-auto {
                  right: auto;
                }
                
                .bottom-auto {
                  bottom: auto;
                }
                
                .left-auto {
                  left: auto;
                }
                
                .resize-none {
                  resize: none;
                }
                
                .resize-y {
                  resize: vertical;
                }
                
                .resize-x {
                  resize: horizontal;
                }
                
                .resize {
                  resize: both;
                }
                
                .shadow-xs {
                  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
                }
                
                .shadow-sm {
                  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                
                .shadow {
                  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                }
                
                .shadow-md {
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                
                .shadow-lg {
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                
                .shadow-xl {
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                .shadow-2xl {
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                
                .shadow-inner {
                  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                }
                
                .shadow-outline {
                  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
                }
                
                .shadow-none {
                  box-shadow: none;
                }
               
                .fill-current {
                  fill: currentColor;
                }
                
                .stroke-current {
                  stroke: currentColor;
                }
                
                .stroke-0 {
                  stroke-width: 0;
                }
                
                .stroke-1 {
                  stroke-width: 1;
                }
                
                .stroke-2 {
                  stroke-width: 2;
                }
                
                .table-auto {
                  table-layout: auto;
                }
                
                .table-fixed {
                  table-layout: fixed;
                }
                
                .text-left {
                  text-align: left;
                }
                
                .text-center {
                  text-align: center;
                }
                
                .text-right {
                  text-align: right;
                }
                
                .text-justify {
                  text-align: justify;
                }
                
                .text-transparent {
                  color: transparent;
                }
                
                .text-current {
                  color: currentColor;
                }
                
                .text-black {
                  --text-opacity: 1;
                  color: #000;
                  color: rgba(0, 0, 0, 1);
                }
                
                .text-white {
                  --text-opacity: 1;
                  color: #fff;
                  color: rgba(255, 255, 255, 1);
                }
                
                .text-gray-100 {
                  --text-opacity: 1;
                  color: #f7fafc;
                  color: rgba(247, 250, 252, 1);
                }
                
                .text-gray-200 {
                  --text-opacity: 1;
                  color: #edf2f7;
                  color: rgba(237, 242, 247, 1);
                }
                
                .text-gray-300 {
                  --text-opacity: 1;
                  color: #e2e8f0;
                  color: rgba(226, 232, 240, 1);
                }
                
                .text-gray-400 {
                  --text-opacity: 1;
                  color: #cbd5e0;
                  color: rgba(203, 213, 224, 1);
                }
                
                .text-gray-500 {
                  --text-opacity: 1;
                  color: #a0aec0;
                  color: rgba(160, 174, 192, 1);
                }
                
                .text-gray-600 {
                  --text-opacity: 1;
                  color: #718096;
                  color: rgba(113, 128, 150, 1);
                }
                
                .text-gray-700 {
                  --text-opacity: 1;
                  color: #4a5568;
                  color: rgba(74, 85, 104, 1);
                }
                
                .text-gray-800 {
                  --text-opacity: 1;
                  color: #2d3748;
                  color: rgba(45, 55, 72, 1);
                }
                
                .text-gray-900 {
                  --text-opacity: 1;
                  color: #1a202c;
                  color: rgba(26, 32, 44, 1);
                }
                
                .text-red-100 {
                  --text-opacity: 1;
                  color: #fff5f5;
                  color: rgba(255, 245, 245, 1);
                }
                
                .text-red-200 {
                  --text-opacity: 1;
                  color: #fed7d7;
                  color: rgba(254, 215, 215, 1);
                }
                
                .text-red-300 {
                  --text-opacity: 1;
                  color: #feb2b2;
                  color: rgba(254, 178, 178, 1);
                }
                
                .text-red-400 {
                  --text-opacity: 1;
                  color: #fc8181;
                  color: rgba(252, 129, 129, 1);
                }
                
                .text-red-500 {
                  --text-opacity: 1;
                  color: #f56565;
                  color: rgba(245, 101, 101, 1);
                }
                
                .text-red-600 {
                  --text-opacity: 1;
                  color: #e53e3e;
                  color: rgba(229, 62, 62, 1);
                }
                
                .text-red-700 {
                  --text-opacity: 1;
                  color: #c53030;
                  color: rgba(197, 48, 48, 1);
                }
                
                .text-red-800 {
                  --text-opacity: 1;
                  color: #9b2c2c;
                  color: rgba(155, 44, 44, 1);
                }
                
                .text-red-900 {
                  --text-opacity: 1;
                  color: #742a2a;
                  color: rgba(116, 42, 42, 1);
                }
                
                .text-orange-100 {
                  --text-opacity: 1;
                  color: #fffaf0;
                  color: rgba(255, 250, 240, 1);
                }
                
                .text-orange-200 {
                  --text-opacity: 1;
                  color: #feebc8;
                  color: rgba(254, 235, 200, 1);
                }
                
                .text-orange-300 {
                  --text-opacity: 1;
                  color: #fbd38d;
                  color: rgba(251, 211, 141, 1);
                }
                
                .text-orange-400 {
                  --text-opacity: 1;
                  color: #f6ad55;
                  color: rgba(246, 173, 85, 1);
                }
                
                .text-orange-500 {
                  --text-opacity: 1;
                  color: #ed8936;
                  color: rgba(237, 137, 54, 1);
                }
                
                .text-orange-600 {
                  --text-opacity: 1;
                  color: #dd6b20;
                  color: rgba(221, 107, 32, 1);
                }
                
                .text-orange-700 {
                  --text-opacity: 1;
                  color: #c05621;
                  color: rgba(192, 86, 33, 1);
                }
                
                .text-orange-800 {
                  --text-opacity: 1;
                  color: #9c4221;
                  color: rgba(156, 66, 33, 1);
                }
                
                .text-orange-900 {
                  --text-opacity: 1;
                  color: #7b341e;
                  color: rgba(123, 52, 30, 1);
                }
                
                .text-yellow-100 {
                  --text-opacity: 1;
                  color: #fffff0;
                  color: rgba(255, 255, 240, 1);
                }
                
                .text-yellow-200 {
                  --text-opacity: 1;
                  color: #fefcbf;
                  color: rgba(254, 252, 191, 1);
                }
                
                .text-yellow-300 {
                  --text-opacity: 1;
                  color: #faf089;
                  color: rgba(250, 240, 137, 1);
                }
                
                .text-yellow-400 {
                  --text-opacity: 1;
                  color: #f6e05e;
                  color: rgba(246, 224, 94, 1);
                }
                
                .text-yellow-500 {
                  --text-opacity: 1;
                  color: #ecc94b;
                  color: rgba(236, 201, 75, 1);
                }
                
                .text-yellow-600 {
                  --text-opacity: 1;
                  color: #d69e2e;
                  color: rgba(214, 158, 46, 1);
                }
                
                .text-yellow-700 {
                  --text-opacity: 1;
                  color: #b7791f;
                  color: rgba(183, 121, 31, 1);
                }
                
                .text-yellow-800 {
                  --text-opacity: 1;
                  color: #975a16;
                  color: rgba(151, 90, 22, 1);
                }
                
                .text-yellow-900 {
                  --text-opacity: 1;
                  color: #744210;
                  color: rgba(116, 66, 16, 1);
                }
                
                .text-green-100 {
                  --text-opacity: 1;
                  color: #f0fff4;
                  color: rgba(240, 255, 244, 1);
                }
                
                .text-green-200 {
                  --text-opacity: 1;
                  color: #c6f6d5;
                  color: rgba(198, 246, 213, 1);
                }
                
                .text-green-300 {
                  --text-opacity: 1;
                  color: #9ae6b4;
                  color: rgba(154, 230, 180, 1);
                }
                
                .text-green-400 {
                  --text-opacity: 1;
                  color: #68d391;
                  color: rgba(104, 211, 145, 1);
                }
                
                .text-green-500 {
                  --text-opacity: 1;
                  color: #48bb78;
                  color: rgba(72, 187, 120, 1);
                }
                
                .text-green-600 {
                  --text-opacity: 1;
                  color: #38a169;
                  color: rgba(56, 161, 105, 1);
                }
                
                .text-green-700 {
                  --text-opacity: 1;
                  color: #2f855a;
                  color: rgba(47, 133, 90, 1);
                }
                
                .text-green-800 {
                  --text-opacity: 1;
                  color: #276749;
                  color: rgba(39, 103, 73, 1);
                }
                
                .text-green-900 {
                  --text-opacity: 1;
                  color: #22543d;
                  color: rgba(34, 84, 61, 1);
                }
                
                .text-teal-100 {
                  --text-opacity: 1;
                  color: #e6fffa;
                  color: rgba(230, 255, 250, 1);
                }
                
                .text-teal-200 {
                  --text-opacity: 1;
                  color: #b2f5ea;
                  color: rgba(178, 245, 234, 1);
                }
                
                .text-teal-300 {
                  --text-opacity: 1;
                  color: #81e6d9;
                  color: rgba(129, 230, 217, 1);
                }
                
                .text-teal-400 {
                  --text-opacity: 1;
                  color: #4fd1c5;
                  color: rgba(79, 209, 197, 1);
                }
                
                .text-teal-500 {
                  --text-opacity: 1;
                  color: #38b2ac;
                  color: rgba(56, 178, 172, 1);
                }
                
                .text-teal-600 {
                  --text-opacity: 1;
                  color: #319795;
                  color: rgba(49, 151, 149, 1);
                }
                
                .text-teal-700 {
                  --text-opacity: 1;
                  color: #2c7a7b;
                  color: rgba(44, 122, 123, 1);
                }
                
                .text-teal-800 {
                  --text-opacity: 1;
                  color: #285e61;
                  color: rgba(40, 94, 97, 1);
                }
                
                .text-teal-900 {
                  --text-opacity: 1;
                  color: #234e52;
                  color: rgba(35, 78, 82, 1);
                }
                
                .text-blue-100 {
                  --text-opacity: 1;
                  color: #ebf8ff;
                  color: rgba(235, 248, 255, 1);
                }
                
                .text-blue-200 {
                  --text-opacity: 1;
                  color: #bee3f8;
                  color: rgba(190, 227, 248, 1);
                }
                
                .text-blue-300 {
                  --text-opacity: 1;
                  color: #90cdf4;
                  color: rgba(144, 205, 244, 1);
                }
                
                .text-blue-400 {
                  --text-opacity: 1;
                  color: #63b3ed;
                  color: rgba(99, 179, 237, 1);
                }
                
                .text-blue-500 {
                  --text-opacity: 1;
                  color: #4299e1;
                  color: rgba(66, 153, 225, 1);
                }
                
                .text-blue-600 {
                  --text-opacity: 1;
                  color: #3182ce;
                  color: rgba(49, 130, 206, 1);
                }
                
                .text-blue-700 {
                  --text-opacity: 1;
                  color: #2b6cb0;
                  color: rgba(43, 108, 176, 1);
                }
                
                .text-blue-800 {
                  --text-opacity: 1;
                  color: #2c5282;
                  color: rgba(44, 82, 130, 1);
                }
                
                .text-blue-900 {
                  --text-opacity: 1;
                  color: #2a4365;
                  color: rgba(42, 67, 101, 1);
                }
                
                .text-indigo-100 {
                  --text-opacity: 1;
                  color: #ebf4ff;
                  color: rgba(235, 244, 255, 1);
                }
                
                .text-indigo-200 {
                  --text-opacity: 1;
                  color: #c3dafe;
                  color: rgba(195, 218, 254, 1);
                }
                
                .text-indigo-300 {
                  --text-opacity: 1;
                  color: #a3bffa;
                  color: rgba(163, 191, 250, 1);
                }
                
                .text-indigo-400 {
                  --text-opacity: 1;
                  color: #7f9cf5;
                  color: rgba(127, 156, 245, 1);
                }
                
                .text-indigo-500 {
                  --text-opacity: 1;
                  color: #667eea;
                  color: rgba(102, 126, 234, 1);
                }
                
                .text-indigo-600 {
                  --text-opacity: 1;
                  color: #5a67d8;
                  color: rgba(90, 103, 216, 1);
                }
                
                .text-indigo-700 {
                  --text-opacity: 1;
                  color: #4c51bf;
                  color: rgba(76, 81, 191, 1);
                }
                
                .text-indigo-800 {
                  --text-opacity: 1;
                  color: #434190;
                  color: rgba(67, 65, 144, 1);
                }
                
                .text-indigo-900 {
                  --text-opacity: 1;
                  color: #3c366b;
                  color: rgba(60, 54, 107, 1);
                }
                
                .text-purple-100 {
                  --text-opacity: 1;
                  color: #faf5ff;
                  color: rgba(250, 245, 255, 1);
                }
                
                .text-purple-200 {
                  --text-opacity: 1;
                  color: #e9d8fd;
                  color: rgba(233, 216, 253, 1);
                }
                
                .text-purple-300 {
                  --text-opacity: 1;
                  color: #d6bcfa;
                  color: rgba(214, 188, 250, 1);
                }
                
                .text-purple-400 {
                  --text-opacity: 1;
                  color: #b794f4;
                  color: rgba(183, 148, 244, 1);
                }
                
                .text-purple-500 {
                  --text-opacity: 1;
                  color: #9f7aea;
                  color: rgba(159, 122, 234, 1);
                }
                
                .text-purple-600 {
                  --text-opacity: 1;
                  color: #805ad5;
                  color: rgba(128, 90, 213, 1);
                }
                
                .text-purple-700 {
                  --text-opacity: 1;
                  color: #6b46c1;
                  color: rgba(107, 70, 193, 1);
                }
                
                .text-purple-800 {
                  --text-opacity: 1;
                  color: #553c9a;
                  color: rgba(85, 60, 154, 1);
                }
                
                .text-purple-900 {
                  --text-opacity: 1;
                  color: #44337a;
                  color: rgba(68, 51, 122, 1);
                }
                
                .text-pink-100 {
                  --text-opacity: 1;
                  color: #fff5f7;
                  color: rgba(255, 245, 247, 1);
                }
                
                .text-pink-200 {
                  --text-opacity: 1;
                  color: #fed7e2;
                  color: rgba(254, 215, 226, 1);
                }
                
                .text-pink-300 {
                  --text-opacity: 1;
                  color: #fbb6ce;
                  color: rgba(251, 182, 206, 1);
                }
                
                .text-pink-400 {
                  --text-opacity: 1;
                  color: #f687b3;
                  color: rgba(246, 135, 179, 1);
                }
                
                .text-pink-500 {
                  --text-opacity: 1;
                  color: #ed64a6;
                  color: rgba(237, 100, 166, 1);
                }
                
                .text-pink-600 {
                  --text-opacity: 1;
                  color: #d53f8c;
                  color: rgba(213, 63, 140, 1);
                }
                
                .text-pink-700 {
                  --text-opacity: 1;
                  color: #b83280;
                  color: rgba(184, 50, 128, 1);
                }
                
                .text-pink-800 {
                  --text-opacity: 1;
                  color: #97266d;
                  color: rgba(151, 38, 109, 1);
                }
                
                .text-pink-900 {
                  --text-opacity: 1;
                  color: #702459;
                  color: rgba(112, 36, 89, 1);
                }
                
                .text-opacity-0 {
                  --text-opacity: 0;
                }
                
                .text-opacity-25 {
                  --text-opacity: 0.25;
                }
                
                .text-opacity-50 {
                  --text-opacity: 0.5;
                }
                
                .text-opacity-75 {
                  --text-opacity: 0.75;
                }
                
                .text-opacity-100 {
                  --text-opacity: 1;
                }
                
                .select-none {
                  -webkit-user-select: none;
                      -ms-user-select: none;
                          user-select: none;
                }
                
                .select-text {
                  -webkit-user-select: text;
                      -ms-user-select: text;
                          user-select: text;
                }
                
                .select-all {
                  -webkit-user-select: all;
                      -ms-user-select: all;
                          user-select: all;
                }
                
                .select-auto {
                  -webkit-user-select: auto;
                      -ms-user-select: auto;
                          user-select: auto;
                }
                
                .align-baseline {
                  vertical-align: baseline;
                }
                
                .align-top {
                  vertical-align: top;
                }
                
                .align-middle {
                  vertical-align: middle;
                }
                
                .align-bottom {
                  vertical-align: bottom;
                }
                
                .align-text-top {
                  vertical-align: text-top;
                }
                
                .align-text-bottom {
                  vertical-align: text-bottom;
                }
                
                .visible {
                  visibility: visible;
                }
                
                .invisible {
                  visibility: hidden;
                }
                
                .whitespace-normal {
                  white-space: normal;
                }
                
                .whitespace-no-wrap {
                  white-space: nowrap;
                }
                
                .whitespace-pre {
                  white-space: pre;
                }
                
                .whitespace-pre-line {
                  white-space: pre-line;
                }
                
                .whitespace-pre-wrap {
                  white-space: pre-wrap;
                }
                
                .break-normal {
                  word-wrap: normal;
                  overflow-wrap: normal;
                  word-break: normal;
                }
                
                .break-words {
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                }
                
                .break-all {
                  word-break: break-all;
                }
                
                .truncate {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                
                .w-0 {
                  width: 0;
                }
                
                .w-1 {
                  width: 0.25rem;
                }
                
                .w-2 {
                  width: 0.5rem;
                }
                
                .w-3 {
                  width: 0.75rem;
                }
                
                .w-4 {
                  width: 1rem;
                }
                
                .w-5 {
                  width: 1.25rem;
                }
                
                .w-6 {
                  width: 1.5rem;
                }
                
                .w-8 {
                  width: 2rem;
                }
                
                .w-10 {
                  width: 2.5rem;
                }
                
                .w-12 {
                  width: 3rem;
                }
                
                .w-16 {
                  width: 4rem;
                }
                
                .w-20 {
                  width: 5rem;
                }
                
                .w-24 {
                  width: 6rem;
                }
                
                .w-32 {
                  width: 8rem;
                }
                
                .w-40 {
                  width: 10rem;
                }
                
                .w-48 {
                  width: 12rem;
                }
                
                .w-56 {
                  width: 14rem;
                }
                
                .w-64 {
                  width: 16rem;
                }
                
                .w-auto {
                  width: auto;
                }
                
                .w-px {
                  width: 1px;
                }
                
                .w-1\\/2 {
                  width: 50%;
                }
                
                .w-1\\/3 {
                  width: 33.333333%;
                }
                
                .w-2\\/3 {
                  width: 66.666667%;
                }
                
                .w-1\\/4 {
                  width: 25%;
                }
                
                .w-2\\/4 {
                  width: 50%;
                }
                
                .w-3\\/4 {
                  width: 75%;
                }
                
                .w-1\\/5 {
                  width: 20%;
                }
                
                .w-2\\/5 {
                  width: 40%;
                }
                
                .w-3\\/5 {
                  width: 60%;
                }
                
                .w-4\\/5 {
                  width: 80%;
                }
                
                .w-1\\/6 {
                  width: 16.666667%;
                }
                
                .w-2\\/6 {
                  width: 33.333333%;
                }
                
                .w-3\\/6 {
                  width: 50%;
                }
                
                .w-4\\/6 {
                  width: 66.666667%;
                }
                
                .w-5\\/6 {
                  width: 83.333333%;
                }
                
                .w-1\\/12 {
                  width: 8.333333%;
                }
                
                .w-2\\/12 {
                  width: 16.666667%;
                }
                
                .w-3\\/12 {
                  width: 25%;
                }
                
                .w-4\\/12 {
                  width: 33.333333%;
                }
                
                .w-5\\/12 {
                  width: 41.666667%;
                }
                
                .w-6\\/12 {
                  width: 50%;
                }
                
                .w-7\\/12 {
                  width: 58.333333%;
                }
                
                .w-8\\/12 {
                  width: 66.666667%;
                }
                
                .w-9\\/12 {
                  width: 75%;
                }
                
                .w-10\\/12 {
                  width: 83.333333%;
                }
                
                .w-11\\/12 {
                  width: 91.666667%;
                }
                
                .w-full {
                  width: 100%;
                }
                
                .w-screen {
                  width: 100vw;
                }
                
                .z-0 {
                  z-index: 0;
                }
                
                .z-10 {
                  z-index: 10;
                }
                
                .z-20 {
                  z-index: 20;
                }
                
                .z-30 {
                  z-index: 30;
                }
                
                .z-40 {
                  z-index: 40;
                }
                
                .z-50 {
                  z-index: 50;
                }
                
                .z-auto {
                  z-index: auto;
                }
            </style>
        
            <head>
                <meta charset="UTF-8">
                <title>LeadMe QA</title>
            </head>

            <body style='background-color:white;'>
                ${reportDivContent}
            </body>
        </html>
    `;
}
