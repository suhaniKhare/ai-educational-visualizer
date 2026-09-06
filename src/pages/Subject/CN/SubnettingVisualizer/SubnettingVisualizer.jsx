import { useMemo, useState } from "react";
import {
  Calculator,
  Network,
  RotateCcw,
  Server,
  Radio,
} from "lucide-react";

import "./SubnettingVisualizer.css";

function ipToNumber(ip) {
  const parts = ip.split(".").map(Number);

  if (
    parts.length !== 4 ||
    parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)
  ) {
    return null;
  }

  return (
    ((parts[0] << 24) >>> 0) +
    ((parts[1] << 16) >>> 0) +
    ((parts[2] << 8) >>> 0) +
    parts[3]
  ) >>> 0;
}

function numberToIp(num) {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join(".");
}

function prefixToMask(prefix) {
  if (prefix === 0) return 0;

  return (0xffffffff << (32 - prefix)) >>> 0;
}

function SubnettingVisualizer() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState(24);

  const result = useMemo(() => {
    const ipNumber = ipToNumber(ip);

    if (ipNumber === null || prefix < 1 || prefix > 30) {
      return null;
    }

    const mask = prefixToMask(prefix);

    const network = (ipNumber & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;

    const totalAddresses = 2 ** (32 - prefix);
    const usableHosts = Math.max(totalAddresses - 2, 0);

    const firstHost =
      usableHosts > 0 ? numberToIp(network + 1) : numberToIp(network);

    const lastHost =
      usableHosts > 0
        ? numberToIp(broadcast - 1)
        : numberToIp(broadcast);

    const binaryMask = mask.toString(2).padStart(32, "0");

    return {
      network: numberToIp(network),
      broadcast: numberToIp(broadcast),
      firstHost,
      lastHost,
      totalAddresses,
      usableHosts,
      binaryMask,
    };
  }, [ip, prefix]);

  const reset = () => {
    setIp("192.168.1.10");
    setPrefix(24);
  };

  const prefixBits = prefix;

  return (
    <main className="subnet-page">
      <section className="subnet-header">
        <span className="subnet-label">COMPUTER NETWORKS</span>

        <h1>
          IP Addressing & <span>Subnetting</span>
        </h1>

        <p>
          Enter an IPv4 address and CIDR prefix to calculate the network,
          broadcast, host range, and subnet capacity.
        </p>
      </section>

      <div className="subnet-layout">
        {/* LEFT */}
        <section className="subnet-panel subnet-controls">
          <div className="subnet-title">
            <Calculator size={20} />
            <h2>Subnet Calculator</h2>
          </div>

          <label>IPv4 Address</label>

          <input
            className="subnet-input"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.10"
          />

          <label>CIDR Prefix</label>

          <select
            className="subnet-input"
            value={prefix}
            onChange={(e) => setPrefix(Number(e.target.value))}
          >
            {Array.from({ length: 30 }, (_, index) => index + 1).map(
              (value) => (
                <option key={value} value={value}>
                  /{value}
                </option>
              )
            )}
          </select>

          <div className="subnet-prefix-display">
            <span>Network Bits</span>
            <strong>{prefixBits}</strong>

            <span>Host Bits</span>
            <strong>{32 - prefixBits}</strong>
          </div>

          <div className="subnet-presets">
            <span>Quick Presets</span>

            <button
              onClick={() => {
                setIp("192.168.1.10");
                setPrefix(24);
              }}
            >
              192.168.1.10 /24
            </button>

            <button
              onClick={() => {
                setIp("10.0.15.25");
                setPrefix(16);
              }}
            >
              10.0.15.25 /16
            </button>

            <button
              onClick={() => {
                setIp("172.16.20.50");
                setPrefix(20);
              }}
            >
              172.16.20.50 /20
            </button>
          </div>

          <button className="subnet-reset" onClick={reset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </section>

        {/* RIGHT */}
        <section className="subnet-panel subnet-result">
          <div className="subnet-result-header">
            <div>
              <span>NETWORK ANALYSIS</span>

              <h2>
                {ip} / {prefix}
              </h2>
            </div>

            <Network size={28} />
          </div>

          {!result ? (
            <div className="subnet-error">
              Please enter a valid IPv4 address and prefix.
            </div>
          ) : (
            <>
              <div className="subnet-cards">
                <div className="subnet-card">
                  <Network size={19} />

                  <span>Network Address</span>

                  <strong>{result.network}</strong>
                </div>

                <div className="subnet-card">
                  <Radio size={19} />

                  <span>Broadcast Address</span>

                  <strong>{result.broadcast}</strong>
                </div>

                <div className="subnet-card">
                  <Server size={19} />

                  <span>First Host</span>

                  <strong>{result.firstHost}</strong>
                </div>

                <div className="subnet-card">
                  <Server size={19} />

                  <span>Last Host</span>

                  <strong>{result.lastHost}</strong>
                </div>
              </div>

              <div className="subnet-visual">
                <div className="subnet-visual-title">
                  <span>32-BIT ADDRESS STRUCTURE</span>
                  <strong>/{prefix}</strong>
                </div>

                <div className="subnet-bits">
                  {result.binaryMask.split("").map((bit, index) => (
                    <span
                      key={index}
                      className={
                        index < prefix ? "network-bit" : "host-bit"
                      }
                    >
                      {bit}
                    </span>
                  ))}
                </div>

                <div className="subnet-legend">
                  <div>
                    <span className="network-dot" />
                    Network Bits
                  </div>

                  <div>
                    <span className="host-dot" />
                    Host Bits
                  </div>
                </div>
              </div>

              <div className="subnet-metrics">
                <div>
                  <span>Total Addresses</span>
                  <strong>
                    {result.totalAddresses.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Usable Hosts</span>
                  <strong>
                    {result.usableHosts.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Host Bits</span>
                  <strong>{32 - prefix}</strong>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <section className="subnet-explanation">
        <span className="subnet-label">CONCEPT</span>

        <h2>How Subnetting Works</h2>

        <div className="subnet-explanation-grid">
          <div>
            <strong>Network Address</strong>
            <p>
              Identifies the subnet itself. All host bits are set to zero.
            </p>
          </div>

          <div>
            <strong>Broadcast Address</strong>
            <p>
              Identifies all devices in the subnet. All host bits are set to
              one.
            </p>
          </div>

          <div>
            <strong>CIDR Prefix</strong>
            <p>
              The /24 notation means that the first 24 bits represent the
              network portion of the IPv4 address.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SubnettingVisualizer;