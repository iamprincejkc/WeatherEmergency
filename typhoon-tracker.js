(function() {
    'use strict';

    const TyphoonTracker = {
        // CSS styles to inject
        styles: `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                background: #1a1a2e;
                color: white;
                overflow: hidden;
            }
            
            .header {
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                padding: 8px 20px 12px;
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 0 0 20px 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 1000;
                min-width: 320px;
                max-width: 400px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 14px;
                color: #ff6b6b;
                margin-bottom: 2px;
                font-weight: 600;
            }
            
            .header p {
                font-size: 10px;
                color: #888;
                margin-bottom: 8px;
            }
            
            .emergency-btn {
                background: rgba(255, 107, 107, 0.15);
                color: #fff;
                border: 1px solid rgba(255, 107, 107, 0.3);
                padding: 8px 18px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-transform: capitalize;
                letter-spacing: 0.3px;
                margin-top: 5px;
            }
            
            .emergency-btn:hover {
                background: rgba(255, 107, 107, 0.25);
                border-color: rgba(255, 107, 107, 0.5);
            }
            
            .emergency-btn:active {
                transform: scale(0.95);
            }
            
            .map-container {
                width: 100%;
                height: 100vh;
                position: relative;
            }
            
            #windy-map {
                width: 100%;
                height: 100%;
                border: none;
            }
            
            .emergency-card {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(20, 20, 25, 0.98);
                padding: 30px;
                border-radius: 20px;
                max-width: 450px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 1001;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: none;
            }
            
            .emergency-card::-webkit-scrollbar {
                width: 8px;
            }
            
            .emergency-card::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            
            .emergency-card::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
            }
            
            .emergency-card::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .emergency-card.active {
                display: block;
            }
            
            .emergency-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                z-index: 1000;
                display: none;
            }
            
            .emergency-overlay.active {
                display: block;
            }
            
            .close-btn {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #fff;
                font-size: 20px;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                line-height: 1;
                transition: all 0.2s ease;
                font-weight: 300;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            
            .emergency-card h3 {
                color: #fff;
                margin-bottom: 20px;
                font-size: 20px;
                text-align: left;
                font-weight: 600;
                letter-spacing: -0.5px;
            }
            
            .search-box {
                position: relative;
                margin-bottom: 20px;
            }
            
            .search-input {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: #fff;
                font-size: 14px;
                font-weight: 400;
                letter-spacing: 0.3px;
                transition: all 0.2s ease;
                outline: none;
            }
            
            .search-input::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }
            
            .search-input:focus {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 107, 107, 0.4);
            }
            
            .hotline-list {
                max-height: calc(80vh - 180px);
                overflow-y: auto;
                padding-right: 5px;
            }
            
            .hotline-list::-webkit-scrollbar {
                width: 6px;
            }
            
            .hotline-list::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .hotline-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 3px;
            }
            
            .hotline-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.25);
            }
            
            .no-results {
                text-align: center;
                color: rgba(255, 255, 255, 0.5);
                padding: 40px 20px;
                font-size: 14px;
            }
            
            .hotline-location {
                background: rgba(255, 255, 255, 0.05);
                padding: 16px;
                margin-bottom: 10px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                transition: all 0.2s ease;
            }
            
            .hotline-location:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 107, 107, 0.3);
            }
            
            .hotline-location h4 {
                color: rgba(255, 255, 255, 0.9);
                font-size: 13px;
                margin-bottom: 12px;
                font-weight: 500;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                opacity: 0.7;
            }
            
            .hotline-number {
                color: #fff;
                font-size: 15px;
                font-weight: 500;
                margin: 6px 0;
                padding: 10px 12px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                letter-spacing: 0.3px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.2s ease;
                border: 1px solid transparent;
            }
            
            .hotline-number:hover {
                background: rgba(255, 107, 107, 0.15);
                border-color: rgba(255, 107, 107, 0.3);
            }
            
            .number-text {
                flex: 1;
                font-variant-numeric: tabular-nums;
            }
            
            .copy-btn {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.8);
                padding: 6px 14px;
                border-radius: 6px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
                text-transform: capitalize;
                letter-spacing: 0.3px;
                margin-left: 10px;
            }
            
            .copy-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.3);
                color: #fff;
            }
            
            .copy-btn:active {
                transform: scale(0.95);
            }
            
            .copy-btn.copied {
                background: rgba(76, 175, 80, 0.2);
                border-color: rgba(76, 175, 80, 0.5);
                color: #4caf50;
            }
            
            .hotline-label {
                color: rgba(255, 107, 107, 0.8);
                font-size: 10px;
                margin-left: 6px;
                padding: 2px 6px;
                background: rgba(255, 107, 107, 0.15);
                border-radius: 3px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .see-more-btn {
                width: 100%;
                padding: 10px;
                margin-top: 10px;
                background: rgba(255, 107, 107, 0.15);
                border: 1px solid rgba(255, 107, 107, 0.3);
                color: rgba(255, 255, 255, 0.9);
                border-radius: 8px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .see-more-btn:hover {
                background: rgba(255, 107, 107, 0.25);
                border-color: rgba(255, 107, 107, 0.5);
            }
            
            .see-more-btn.expanded {
                background: rgba(255, 107, 107, 0.25);
            }
            
            .barangay-contacts {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .barangay-item {
                margin-bottom: 12px;
            }
            
            .barangay-name {
                display: block;
                color: rgba(255, 255, 255, 0.7);
                font-size: 11px;
                font-weight: 500;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            @media (max-width: 768px) {
                .header {
                    min-width: 280px;
                    max-width: 90%;
                }
                
                .emergency-card {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    transform: none;
                    width: 85%;
                    max-width: 350px;
                    max-height: 100vh;
                    padding: 25px 20px 20px;
                    border-radius: 0 16px 16px 0;
                }
                
                .emergency-card h3 {
                    font-size: 18px;
                    margin-bottom: 15px;
                }
                
                .search-box {
                    margin-bottom: 15px;
                }
                
                .search-input {
                    padding: 14px;
                    font-size: 16px;
                }
                
                .hotline-list {
                    max-height: calc(100vh - 150px);
                }
                
                .hotline-location {
                    padding: 14px;
                }
                
                .hotline-location h4 {
                    font-size: 12px;
                }
                
                .hotline-number {
                    font-size: 15px;
                    flex-direction: column;
                    align-items: stretch;
                    padding: 12px;
                }
                
                .number-text {
                    margin-bottom: 8px;
                }
                
                .copy-btn {
                    margin-left: 0;
                    width: 100%;
                    padding: 10px;
                    font-size: 12px;
                }
                
                .map-container {
                    height: 100vh;
                }
            }
        `,

        // HTML structure to inject
        html: `
            <div class="header">
                <h1>🌀 Philippines Typhoon Tracker</h1>
                <p>Real-time tracking of active storms</p>
                <button class="emergency-btn" onclick="window.TyphoonTrackerPlugin.toggleEmergency()">
                    Emergency Hotlines
                </button>
            </div>
            <div class="map-container">
                <iframe id="windy-map"></iframe>
            </div>
            <div class="emergency-overlay" onclick="window.TyphoonTrackerPlugin.toggleEmergency()"></div>
            <div class="emergency-card">
                <button class="close-btn" onclick="window.TyphoonTrackerPlugin.toggleEmergency()">×</button>
                <h3>Emergency Hotlines</h3>
                <div class="search-box">
                    <input type="text" class="search-input" placeholder="Search by location..." oninput="window.TyphoonTrackerPlugin.searchHotlines(this.value)">
                </div>
                <div class="hotline-list">
                    
                    <div class="hotline-location">
                        <h4>ALCANTARA</h4>
                        <div class="hotline-number">
                            <span class="number-text">0919 067 0898</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09190670898', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0915 901 8000</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09159018000', this)">Copy</button>
                        </div>
                    </div>

                    <div class="hotline-location">
                        <h4>CEBU PROVINCE</h4>
                        <div class="hotline-number">
                            <span class="number-text">911</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('911', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CEBU CITY FIRE OFFICE</h4>
                        <div class="hotline-number">
                            <span class="number-text">256-0541</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('2560541', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">256-0542</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('2560542', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">160</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('160', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>PHILIPPINE RED CROSS (CEBU CHAPTER)</h4>
                        <div class="hotline-number">
                            <span class="number-text">0915 583 9829</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09155839829', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">328-9238</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('3289238', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CEBU CITY COMMAND CENTER</h4>
                        <div class="hotline-number">
                            <span class="number-text">166</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('166', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">262-1424</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('2621424', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0932 537 7770</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09325377770', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0949 161 4888</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09491614888', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CEBU CITY DISASTER RISK REDUCTION</h4>
                        <div class="hotline-number">
                            <span class="number-text">0917 839 9896</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09178399896', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CEBU PROVINCIAL DISASTER RISK REDUCTION</h4>
                        <div class="hotline-number">
                            <span class="number-text">255-0046</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('2550046', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>ERUF (EMERGENCY RESCUE UNIT FOUNDATION)</h4>
                        <div class="hotline-number">
                            <span class="number-text">161</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('161', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0918 921 0000</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09189210000', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">233-9300</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('2339300', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">255-7287</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('2557287', this)">Copy</button>
                        </div>
                    </div>
                    
                    
                    
                    
                    
                    <div class="hotline-location">
                        <h4>BANTAY MANDAUE DISASTER RISK REDUCTION</h4>
                        <div class="hotline-number">
                            <span class="number-text">420-2868</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('4202868', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>TALISAY CITY DISASTER OFFICE</h4>
                        <div class="hotline-number">
                            <span class="number-text">491-4159</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('4914159', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>BUREAU OF FIRE TALISAY CITY</h4>
                        <div class="hotline-number">
                            <span class="number-text">272-8277</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('2728277', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>TALAMBAN EMERGENCY HOTLINE</h4>
                        <div class="hotline-number">
                            <span class="number-text">402-6873</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('4026873', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">503-6847</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('5036847', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">421-9178</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('4219178', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>UMAPAD</h4>
                        <div class="hotline-number">
                            <span class="number-text">0966 086 5821</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09660865821', this)">Copy</button>
                        </div>
                    </div>

                    
                    <div class="hotline-location">
                        <h4>ALEGRIA</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 476 7604</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0324767604', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0928 743 1788</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09287431788', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>BADIAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">0999 986 3435</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09999863435', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">(032) 413 0234</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0324130234', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>BANTAYAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">0910 622 6622</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09106226622', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0915 848 6678</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09158486678', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>BARILI</h4>
                        <div class="hotline-number">
                            <span class="number-text">0918 637 6365</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09186376365', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0998 598 6361 <span class="hotline-label">(PNP)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09985986361', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>BOGO CITY</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 342 0580</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0323420580', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0945 685 2435</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09456852435', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0917 920 4635</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09179204635', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0995 614 6128 <span class="hotline-label">(Command Center)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09956146128', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>BORBON</h4>
                        <div class="hotline-number">
                            <span class="number-text">0999 986 6063</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09999866063', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0998 598 6381 <span class="hotline-label">(PNP)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09985986381', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CARMEN</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 429 2053</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0324292053', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0934 976 5885</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09349765885', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CATMON</h4>
                        <div class="hotline-number">
                            <span class="number-text">0981 188 8559</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09811888559', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">(032) 326 4223</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0323264223', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0927 939 2321 <span class="hotline-label">(PNP)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09279392321', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>COMPOSTELA</h4>
                        <div class="hotline-number">
                            <span class="number-text">0917 812 6148</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09178126148', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CONSOLACION</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 236 2003</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0322362003', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0931 214 9134</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09312149134', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>CORDOVA</h4>
                        <div class="hotline-number">
                            <span class="number-text">0917 149 8457</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171498457', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0917 116 9819</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171169819', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>DAANBANTAYAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">0926 825 3800</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09268253800', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0999 989 7792</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09999897792', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>DANAO CITY</h4>
                        <div class="hotline-number">
                            <span class="number-text">0917 153 6955</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171536955', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0998 598 6379 <span class="hotline-label">(PNP)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09985986379', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>DUMANJUG</h4>
                        <div class="hotline-number">
                            <span class="number-text">0998 733 3000</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09987333000', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0998 598 6358 <span class="hotline-label">(PNP)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09985986358', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>GINATILAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 401 4165</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0324014165', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0917 845 5714</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09178455714', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>LILOAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">0956 271 1967</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09562711967', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0923 905 9077</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09239059077', this)">Copy</button>
                        </div>
                    </div>

                    <div class="hotline-location">
                        <h4>LAPU-LAPU CITY</h4>
                        <div class="hotline-number">
                            <span class="number-text">911 <span class="hotline-label">(Emergency)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('911', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">431-3771 <span class="hotline-label">(Command Center)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('4313771', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">340-0252 <span class="hotline-label">(Fire)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('3400252', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0999 972 1111 <span class="hotline-label">(Rescue DRRMO)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09999721111', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0917 849 4497 <span class="hotline-label">(Rescue DRRMO)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09178494497', this)">Copy</button>
                        </div>
                        <button class="see-more-btn" onclick="window.TyphoonTrackerPlugin.toggleBarangays(this)">See Barangay Contacts</button>
                        <div class="barangay-contacts" style="display: none;">
                            <div class="barangay-item">
                                <span class="barangay-name">AGUS</span>
                                <div class="hotline-number">
                                    <span class="number-text">0960 899 7407 <span class="hotline-label">(BPSO)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09608997407', this)">Copy</button>
                                </div>
                                <div class="hotline-number">
                                    <span class="number-text">0991 444 1695 <span class="hotline-label">(BDRRM)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09914441695', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">BUAYA</span>
                                <div class="hotline-number">
                                    <span class="number-text">0991 365 0593 <span class="hotline-label">(BPSO)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09913650593', this)">Copy</button>
                                </div>
                                <div class="hotline-number">
                                    <span class="number-text">0932 542 7433 <span class="hotline-label">(BDRRM)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09325427433', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CANJULAO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0923 423 7311</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09234237311', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">GUN-OB</span>
                                <div class="hotline-number">
                                    <span class="number-text">0969 378 2275</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09693782275', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">LOOC</span>
                                <div class="hotline-number">
                                    <span class="number-text">0969 418 2279 <span class="hotline-label">(BPSO)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09694182279', this)">Copy</button>
                                </div>
                                <div class="hotline-number">
                                    <span class="number-text">0962 355 4116 <span class="hotline-label">(BDRRM)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09623554116', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">MACTAN</span>
                                <div class="hotline-number">
                                    <span class="number-text">0969 393 4298</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09693934298', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">PAJAC</span>
                                <div class="hotline-number">
                                    <span class="number-text">0963 756 2588 <span class="hotline-label">(BPSO)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09637562588', this)">Copy</button>
                                </div>
                                <div class="hotline-number">
                                    <span class="number-text">0912 930 4751 <span class="hotline-label">(BDRRM)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09129304751', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">PAJO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0917 106 7233</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171067233', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">PANGAN-AN</span>
                                <div class="hotline-number">
                                    <span class="number-text">0917 169 2474</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171692474', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">PUSOK</span>
                                <div class="hotline-number">
                                    <span class="number-text">0908 882 3943 <span class="hotline-label">(BPSO)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09088823943', this)">Copy</button>
                                </div>
                                <div class="hotline-number">
                                    <span class="number-text">0967 093 8045 <span class="hotline-label">(BDRRM)</span></span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09670938045', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">SUBABASBAS</span>
                                <div class="hotline-number">
                                    <span class="number-text">0919 378 1130</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09193781130', this)">Copy</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div class="hotline-location">
                        <h4>MADRIDEJOS</h4>
                        <div class="hotline-number">
                            <span class="number-text">0969 316 2221</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09693162221', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0950 301 9841</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09503019841', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0916 647 3749</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09166473749', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>MALABUYOC</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 477 8079</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0324778079', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>MANDAUE CITY</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 383 1658</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0323831658', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">(032) 346 0784</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0323460784', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0917 111 6633</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171116633', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0949 162 2565</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09491622565', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">344-4747</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('3444747', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">344-3364</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('3443364', this)">Copy</button>
                        </div>
                        <button class="see-more-btn" onclick="window.TyphoonTrackerPlugin.toggleBarangays(this)">See Barangay Contacts</button>
                        <div class="barangay-contacts" style="display: none;">
                            <div class="barangay-item">
                                <span class="barangay-name">ALANG-ALANG BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0923 465 9604</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09234659604', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">BAKILID BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0976 549 1277</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09765491277', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">BANILAD BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0939 902 5340</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09399025340', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">BASAK BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0909 945 1338</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09099451338', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CABANCALAN BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0962 711 7117</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09627117117', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CAMBARO BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0991 226 8589</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09912268589', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CANDUMAN BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0949 161 5099</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09491615099', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CASILI BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0993 876 7162</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09938767162', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CASUNTINGAN BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0915 018 6392</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09150186392', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CENTRO BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0962 268 9849</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09622689849', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">CUBACUB BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0929 689 1350</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09296891350', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">GUIZO BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0922 497 1986</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09224971986', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">IBABAO-ESTANCIA BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0935 376 1080</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09353761080', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">JAGOBIAO BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0994 261 7703</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09942617703', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">LABOGON BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0927 401 2389</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09274012389', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">LOOC BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0954 248 7797</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09542487797', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">MAGUIKAY BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0922 217 8025</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09222178025', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">MANTUYONG BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0922 844 9940</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09228449940', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">OPAO BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0995 794 4727</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09957944727', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">PAGSABUNGAN BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0927 833 7062</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09278337062', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">PAKNAAN BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0962 892 0266</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09628920266', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">SUBANGDAKU BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0927 721 1287</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09277211287', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">TABOK BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0994 388 9656</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09943889656', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">TAWASON BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0956 294 1182</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09562941182', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">TINGUB BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0932 457 6137</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09324576137', this)">Copy</button>
                                </div>
                            </div>
                            <div class="barangay-item">
                                <span class="barangay-name">TIPOLO BDRRMO</span>
                                <div class="hotline-number">
                                    <span class="number-text">0919 339 7741</span>
                                    <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09193397741', this)">Copy</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>MEDELLIN</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 266 6875</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0322666875', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0932 866 7704</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09328667704', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0917 623 6135</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09176236135', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>MOALBOAL</h4>
                        <div class="hotline-number">
                            <span class="number-text">0908 813 0370</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09088130370', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>PILAR</h4>
                        <div class="hotline-number">
                            <span class="number-text">0962 378 3605</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09623783605', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>PINAMUNGAJAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">(032) 468 9686</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('0324689686', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0949 802 4194</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09498024194', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>PORO</h4>
                        <div class="hotline-number">
                            <span class="number-text">0995 156 8504</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09951568504', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>RONDA</h4>
                        <div class="hotline-number">
                            <span class="number-text">0970 778 7777</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09707787777', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>SAN FRANCISCO</h4>
                        <div class="hotline-number">
                            <span class="number-text">0929 541 2144</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09295412144', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>SANTA FE</h4>
                        <div class="hotline-number">
                            <span class="number-text">0981 446 7661</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09814467661', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0927 447 5176</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09274475176', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>SOGOD</h4>
                        <div class="hotline-number">
                            <span class="number-text">0906 537 0939</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09065370939', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0995 873 6046</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09958736046', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>TABOGON</h4>
                        <div class="hotline-number">
                            <span class="number-text">0917 114 0556</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171140556', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>TABUELAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">0960 828 4513</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09608284513', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>TOLEDO CITY</h4>
                        <div class="hotline-number">
                            <span class="number-text">0956 817 4215</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09568174215', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0915 642 6842 <span class="hotline-label">(PNP)</span></span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09156426842', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>TUDELA</h4>
                        <div class="hotline-number">
                            <span class="number-text">0977 764 1563</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09777641563', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0922 692 4506</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09226924506', this)">Copy</button>
                        </div>
                    </div>
                    
                    <div class="hotline-location">
                        <h4>TUBURAN</h4>
                        <div class="hotline-number">
                            <span class="number-text">0933 214 1382</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09332141382', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0917 116 1363</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09171161363', this)">Copy</button>
                        </div>
                        <div class="hotline-number">
                            <span class="number-text">0951 558 4283</span>
                            <button class="copy-btn" onclick="window.TyphoonTrackerPlugin.copyNumber('09515584283', this)">Copy</button>
                        </div>
                    </div>
                </div>
                <div class="no-results" style="display: none;">No locations found</div>
            </div>
        `,

        // Inject CSS into page
        injectCSS: function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = this.styles;
            } else {
                style.appendChild(document.createTextNode(this.styles));
            }
            document.getElementsByTagName('head')[0].appendChild(style);
        },

        // Inject HTML into body
        injectHTML: function() {
            document.getElementsByTagName('body')[0].innerHTML = this.html;
        },

        // Setup the Windy map
        setupMap: function() {
            const iframe = document.getElementById('windy-map');
            if (iframe) {
                iframe.src = 'https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=7&overlay=wind&product=ecmwf&level=surface&lat=12.8797&lon=121.7740&detailLat=14.5995&detailLon=120.9842&marker=true&message=true';
                iframe.setAttribute('frameborder', '0');
            }
        },

        // Auto-refresh page every 30 minutes
        autoRefresh: function() {
            setTimeout(function() {
                window.location.reload();
            }, 1800000); // 30 minutes
        },

        // Log initialization
        logInit: function() {
            console.log('Typhoon Tracker loaded at: ' + new Date().toLocaleString());
        },

        // Toggle emergency hotlines modal
        toggleEmergency: function() {
            const card = document.querySelector('.emergency-card');
            const overlay = document.querySelector('.emergency-overlay');
            
            if (card && overlay) {
                card.classList.toggle('active');
                overlay.classList.toggle('active');
            }
        },

        // Copy phone number without spaces
        copyNumber: function(number, button) {
            // Copy to clipboard
            navigator.clipboard.writeText(number).then(function() {
                // Change button text and style
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(function() {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy:', err);
                button.textContent = 'Error';
                setTimeout(function() {
                    button.textContent = 'Copy';
                }, 2000);
            });
        },

        // Search hotlines by location name
searchHotlines: function(query) {
    const locations = document.querySelectorAll('.hotline-location');
    const noResults = document.querySelector('.no-results');
    const searchTerm = query.toLowerCase().trim();
    let visibleCount = 0;

    locations.forEach(function(location) {
        const locationName = location.querySelector('h4').textContent.toLowerCase();
        let hasMatch = locationName.includes(searchTerm);
        
        // Also search in barangay names
        const barangayNames = location.querySelectorAll('.barangay-name');
        let matchedBarangay = false;
        
        barangayNames.forEach(function(barangay) {
            const barangayText = barangay.textContent.toLowerCase();
            if (barangayText.includes(searchTerm)) {
                hasMatch = true;
                matchedBarangay = true;
            }
        });
        
        if (hasMatch) {
            location.style.display = 'block';
            visibleCount++;
            
            // If a barangay matched, expand the barangay section
            if (matchedBarangay) {
                const barangaySection = location.querySelector('.barangay-contacts');
                const seeMoreBtn = location.querySelector('.see-more-btn');
                if (barangaySection && seeMoreBtn) {
                    barangaySection.style.display = 'block';
                    seeMoreBtn.textContent = 'Hide Barangay Contacts';
                    seeMoreBtn.classList.add('expanded');
                }
            }
        } else {
            location.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (visibleCount === 0 && searchTerm !== '') {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
},

        // Toggle barangay contacts visibility
        toggleBarangays: function(button) {
            const barangaySection = button.nextElementSibling;
            
            if (barangaySection.style.display === 'none') {
                barangaySection.style.display = 'block';
                button.textContent = 'Hide Barangay Contacts';
                button.classList.add('expanded');
            } else {
                barangaySection.style.display = 'none';
                button.textContent = 'See Barangay Contacts';
                button.classList.remove('expanded');
            }
        },

        // Initialize everything
        init: function() {
            this.injectCSS();
            this.injectHTML();
            this.setupMap();
            this.autoRefresh();
            this.logInit();
        }
    };

    // Make it globally accessible
    window.TyphoonTrackerPlugin = TyphoonTracker;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            TyphoonTracker.init();
        });
    } else {
        TyphoonTracker.init();
    }

    // Alias for backward compatibility
    if (typeof window.TyphoonTracker === 'undefined') {
        window.TyphoonTracker = window.TyphoonTrackerPlugin;
    }

})();