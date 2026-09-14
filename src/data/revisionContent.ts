export interface RevisionSection {
  heading: string;
  bullets: string[];
}

export interface SubjectRevision {
  key: string;
  title: string;
  color: string;
  sections: RevisionSection[];
}

export const REVISION_CONTENT: SubjectRevision[] = [
  {
    key: 'os',
    title: 'Operating Systems',
    color: '#6366f1',
    sections: [
      {
        heading: 'Process Scheduling',
        bullets: [
          'FCFS: simple, non-preemptive, suffers convoy effect.',
          'SJF: minimizes average waiting time; non-preemptive version needs burst time known in advance.',
          'SRTF: preemptive SJF; preempts on shorter remaining burst arrival.',
          'Round Robin: preemptive, time quantum driven; too small → high context-switch overhead, too large → degenerates to FCFS.',
          'Priority scheduling: can starve low-priority processes — fixed via aging.',
          'Turnaround time = Completion − Arrival; Waiting time = Turnaround − Burst.',
        ],
      },
      {
        heading: 'Process Synchronization',
        bullets: [
          'Critical section needs: Mutual Exclusion, Progress, Bounded Waiting.',
          "Peterson's solution works only for 2 processes; uses turn + flag[] variables.",
          'Semaphore: wait()/P() decrements, signal()/V() increments; binary semaphore ≈ mutex.',
          'Counting semaphore controls access to a resource with multiple instances.',
          'Classic problems: Producer-Consumer (bounded buffer), Readers-Writers, Dining Philosophers.',
          'Monitors provide mutual exclusion implicitly; use condition variables (wait/signal).',
        ],
      },
      {
        heading: 'Deadlocks',
        bullets: [
          'Necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait — all 4 needed.',
          "Banker's Algorithm: avoidance strategy; checks if a state is safe before granting request.",
          'Safe state = a sequence exists where every process can finish.',
          'Deadlock detection: resource allocation graph with cycle detection (single instance) or matrix-based (multi-instance).',
          'Recovery: process termination (all or one-by-one) or resource preemption.',
        ],
      },
      {
        heading: 'Memory Management',
        bullets: [
          'Paging: fixed-size frames/pages; eliminates external fragmentation but causes internal fragmentation.',
          'Segmentation: variable-size logical divisions; causes external fragmentation.',
          'Page table entry: frame number + valid bit + protection bits + dirty bit + reference bit.',
          'TLB (Translation Lookaside Buffer) caches page table entries — TLB hit avoids extra memory access.',
          'Effective Access Time = hit_ratio × (TLB + memory) + miss_ratio × (TLB + 2×memory), for single-level paging.',
          'Multi-level paging reduces page table size at the cost of extra memory accesses per translation.',
        ],
      },
      {
        heading: 'Page Replacement & Virtual Memory',
        bullets: [
          'FIFO can suffer Belady\'s Anomaly (more frames → more page faults, in rare cases).',
          'Optimal (OPT): replaces page used farthest in future — theoretical lower bound, not implementable.',
          'LRU: replaces least recently used page — commonly tested via stack/counter simulation.',
          'Thrashing: excessive paging activity, low CPU utilization — fixed via working set model or reducing degree of multiprogramming.',
          'Demand paging loads pages only when referenced (page fault triggers load).',
        ],
      },
      {
        heading: 'File Systems & Disk Scheduling',
        bullets: [
          'Contiguous allocation: fast access, external fragmentation, hard to grow files.',
          'Linked allocation: no external fragmentation, no random access, pointer overhead.',
          'Indexed allocation (i-nodes): random access, but index block overhead.',
          'FCFS disk scheduling: simple, high seek time.',
          'SSTF: minimizes seek time greedily but can starve far requests.',
          'SCAN/C-SCAN: elevator algorithm — moves in one direction; C-SCAN treats disk as circular for fairness.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Distinguish "number of page faults" (count each miss) vs "hit ratio" carefully in numericals.',
          'In Banker\'s Algorithm, always check Need = Max − Allocation before running the safety algorithm.',
          'Context switch time counts against CPU utilization — don\'t forget it in scheduling numericals.',
          'Segmentation with paging (hybrid) is a favorite MSQ trap — segments map to page tables, not frames directly.',
        ],
      },
    ],
  },
  {
    key: 'dbms',
    title: 'DBMS',
    color: '#8b5cf6',
    sections: [
      {
        heading: 'ER Model & Relational Model',
        bullets: [
          'Total vs partial participation, and 1:1 / 1:N / M:N cardinality — decides where the foreign key goes.',
          'Weak entity needs a partial key + identifying relationship with an owner entity.',
          'A relation is in 1NF if all attributes are atomic (no multi-valued/composite attributes stored directly).',
        ],
      },
      {
        heading: 'Normalization',
        bullets: [
          '2NF: no partial dependency of non-prime attribute on a candidate key (relevant only for composite keys).',
          '3NF: no transitive dependency of non-prime attribute on a candidate key.',
          'BCNF: for every FD X→Y, X must be a superkey (stricter than 3NF).',
          'Closure of attribute set X (X+): all attributes functionally determined by X — used to find candidate keys.',
          'Candidate key = minimal attribute set whose closure = all attributes of the relation.',
          'Lossless join decomposition: common attribute must be a key in at least one of the decomposed relations.',
          'Dependency preserving: union of FDs on decomposed relations must be equivalent to original FD set.',
        ],
      },
      {
        heading: 'Relational Algebra & SQL',
        bullets: [
          'σ (select, row filter), π (project, column filter), ⋈ (join), ÷ (division — "for all" queries).',
          'Natural join = combines on common attribute names automatically; theta join uses explicit condition.',
          'SQL execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.',
          'HAVING filters groups (post-aggregation); WHERE filters rows (pre-aggregation).',
          'NULL comparisons: NULL = NULL is UNKNOWN, not TRUE — use IS NULL.',
          'Correlated subquery re-evaluates per outer row; uncorrelated runs once.',
        ],
      },
      {
        heading: 'Transactions & Concurrency Control',
        bullets: [
          'ACID: Atomicity, Consistency, Isolation, Durability.',
          'Schedule is conflict-serializable if its precedence graph has no cycle.',
          'Two-Phase Locking (2PL): growing phase (acquire only) then shrinking phase (release only) — guarantees conflict-serializability.',
          'Strict 2PL releases all locks only at commit/abort — prevents cascading rollback.',
          'Deadlock in 2PL handled via wait-die / wound-wait (timestamp-based) schemes.',
          'Isolation levels (weakest→strongest): Read Uncommitted, Read Committed, Repeatable Read, Serializable.',
        ],
      },
      {
        heading: 'Indexing',
        bullets: [
          'Primary index: on the sort key of an ordered file, one entry per block (sparse) — dense if one entry per record.',
          'Clustering index: on a non-key attribute that still orders the file.',
          'Secondary index: dense index on a non-ordering field; needed for fast search on non-key attributes.',
          'B+ tree: all data pointers at leaf level, leaves linked — great for range queries; order/height numericals are common.',
          'B+ tree height ≈ ⌈log_⌈n/2⌉(N)⌉ — practice with a given fan-out and number of records.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'BCNF decomposition is not always dependency-preserving — 3NF guarantees both lossless + dependency preserving.',
          'A relation can have multiple candidate keys — check ALL of them, not just the "obvious" one, when testing normal form.',
          'Distinguish DELETE (removes rows) vs DROP (removes table/schema) vs TRUNCATE (removes rows, resets identity, minimal logging).',
          'In join numericals, cost = min(|R|,|S|) with proper indexing assumption — read the question carefully for which join algorithm is implied.',
        ],
      },
    ],
  },
  {
    key: 'cn',
    title: 'Computer Networks',
    color: '#06b6d4',
    sections: [
      {
        heading: 'Layers (OSI vs TCP/IP)',
        bullets: [
          'OSI 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
          'TCP/IP 4-5 layers: Link, Internet, Transport, Application (Session/Presentation folded into Application).',
          'Know which layer each device works at: Hub/Repeater (Physical), Switch/Bridge (Data Link), Router (Network), Gateway (any/Application).',
        ],
      },
      {
        heading: 'Data Link Layer',
        bullets: [
          'Framing: byte stuffing / bit stuffing (0-stuffing after 5 consecutive 1s in HDLC).',
          'CRC: append remainder of polynomial division; receiver checks remainder = 0.',
          'Sliding window: sender window size ≤ 2^n − 1 (Go-Back-N) or 2^(n-1) (Selective Repeat), where n = sequence number bits.',
          'Efficiency = Tt / (Tt + 2×Tp) for stop-and-wait; use bandwidth-delay product for pipelining numericals.',
        ],
      },
      {
        heading: 'Network Layer',
        bullets: [
          'IPv4 address classes: A (0-127), B (128-191), C (192-223) — but classless (CIDR) is what\'s actually tested now.',
          'Subnetting: given a /prefix, number of subnets = 2^(borrowed bits), hosts/subnet = 2^(host bits) − 2.',
          'Routing: Distance Vector (Bellman-Ford, e.g. RIP) vs Link State (Dijkstra, e.g. OSPF).',
          'Fragmentation happens when packet size > MTU; each fragment gets its own IP header with offset field.',
          'ARP resolves IP→MAC (within same network); default gateway used for cross-network delivery.',
        ],
      },
      {
        heading: 'Transport Layer',
        bullets: [
          'TCP: connection-oriented, reliable, ordered, uses 3-way handshake (SYN, SYN-ACK, ACK).',
          'UDP: connectionless, no reliability/ordering guarantee, lower overhead — used for DNS, streaming, DHCP.',
          'TCP congestion control: Slow Start (exponential growth) → Congestion Avoidance (linear/AIMD) → on loss: halve threshold.',
          'Flow control (receiver-driven, window-based) is different from congestion control (network-driven).',
          'Port numbers: well-known (0–1023), registered (1024–49151), dynamic/private (49152–65535).',
        ],
      },
      {
        heading: 'Application Layer',
        bullets: [
          'DNS: hierarchical, UDP port 53 (TCP for zone transfers); resolves domain → IP.',
          'HTTP is stateless; cookies/sessions used to maintain state.',
          'SMTP for sending mail, POP3/IMAP for retrieving — IMAP keeps mail on server, POP3 typically downloads.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Effective throughput numericals: always check whether it\'s stop-and-wait or sliding window before applying formula.',
          'Subnetting: double-check whether the question wants usable hosts (subtract network + broadcast) or total addresses.',
          'CRC generator polynomial degree = number of check bits appended, not the length of the polynomial string itself.',
        ],
      },
    ],
  },
  {
    key: 'coa',
    title: 'Computer Organization & Architecture',
    color: '#10b981',
    sections: [
      {
        heading: 'Instruction Sets & Addressing Modes',
        bullets: [
          'Addressing modes: immediate, direct, indirect, register, indexed, base+offset — know effective address computation for each.',
          'CISC: variable-length instructions, more addressing modes, multi-cycle. RISC: fixed-length, load/store architecture, pipeline-friendly.',
        ],
      },
      {
        heading: 'Pipelining',
        bullets: [
          'Speedup (ideal) = k stages for k instructions in steady state → k×n / (k+n−1) for n instructions.',
          'Hazards: Structural (resource conflict), Data (RAW/WAR/WAW), Control (branches).',
          'Data hazard fix: forwarding/bypassing, or stalling (bubble insertion).',
          'Control hazard fix: branch prediction, delayed branching, branch target buffer.',
          'Cycle time of pipeline = max(stage delays) + latch delay — a classic numerical trap.',
        ],
      },
      {
        heading: 'Cache Memory',
        bullets: [
          'Direct-mapped: block placed in exactly one line (index = block# mod #lines) — fast but more conflict misses.',
          'Fully associative: block can go anywhere — needs comparator per line, expensive.',
          'Set-associative: hybrid; k-way means k possible lines per set.',
          'Address split: Tag | Index | Block Offset (direct-mapped/set-associative); Tag | Block Offset (fully associative).',
          'AMAT = Hit time + Miss rate × Miss penalty (extend for multi-level cache hierarchies).',
          'Write policies: write-through (always update memory) vs write-back (update on eviction, needs dirty bit).',
          'Cache thrashing: repeated conflict misses when multiple active blocks map to the same set/line.',
        ],
      },
      {
        heading: 'Memory & I/O',
        bullets: [
          'Memory interleaving spreads consecutive addresses across banks to allow parallel access — improves bandwidth.',
          'DMA transfers data directly between I/O device and memory without CPU intervention (CPU only sets up transfer).',
          'Interrupt-driven I/O vs polling: interrupts avoid busy-waiting but add context-switch overhead per interrupt.',
        ],
      },
      {
        heading: 'Number Representation & ALU',
        bullets: [
          "2's complement range for n bits: −2^(n−1) to 2^(n−1)−1; overflow occurs when two same-sign operands give a different-sign result.",
          'Floating point (IEEE 754 single): 1 sign + 8 exponent (bias 127) + 23 mantissa bits.',
          'Booth\'s algorithm: multiplies signed numbers using the recoding of multiplier bits (10→subtract, 01→add).',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'In pipeline numericals, always double check whether "delay" given is per stage or total — mismatched units are a frequent error.',
          'Cache numericals: recompute tag/index/offset bit-widths from scratch for each question — don\'t reuse a memorized split.',
          "Booth's algorithm requires an extra bit (Q₋₁) — don't forget the initial 0 appended to the multiplier.",
        ],
      },
    ],
  },
  {
    key: 'toc',
    title: 'Theory of Computation',
    color: '#f59e0b',
    sections: [
      {
        heading: 'Finite Automata & Regular Languages',
        bullets: [
          'DFA: exactly one transition per symbol per state — deterministic, no ambiguity.',
          'NFA: can have multiple/zero transitions per symbol — every NFA has an equivalent DFA (subset construction).',
          'Regular languages are closed under union, intersection, concatenation, Kleene star, and complement.',
          "Pumping Lemma for regular languages: used to PROVE a language is NOT regular (find a string, then show pumping fails for some split).",
          'Myhill-Nerode theorem: minimum number of DFA states = number of distinguishable equivalence classes.',
        ],
      },
      {
        heading: 'Context-Free Grammars & PDA',
        bullets: [
          'CFG: productions of the form A → α, where A is a single non-terminal.',
          'Ambiguous grammar: a string has more than one parse tree / leftmost derivation.',
          'CNF (Chomsky Normal Form): A→BC or A→a; useful for CYK parsing and proving pumping lemma for CFLs.',
          'PDA accepts CFLs — uses a stack for unbounded memory; acceptance by final state or empty stack (equivalent power).',
          'CFLs closed under union, concatenation, Kleene star — NOT closed under intersection or complement in general.',
        ],
      },
      {
        heading: 'Turing Machines & Decidability',
        bullets: [
          'TM = finite control + infinite tape + read/write head — most powerful computational model (Church-Turing thesis).',
          'Recursive (decidable) languages: TM always halts (accept or reject).',
          'Recursively enumerable (semi-decidable): TM halts and accepts on strings in the language, but may loop forever on strings not in it.',
          'Halting problem is undecidable — the classic diagonalization-based proof — foundation for many other undecidability proofs (via reduction).',
          'Rice\'s theorem: any non-trivial property of the language recognized by a TM is undecidable.',
        ],
      },
      {
        heading: 'Chomsky Hierarchy',
        bullets: [
          'Type 0: unrestricted grammars → recursively enumerable languages, recognized by TM.',
          'Type 1: context-sensitive grammars → CSLs, recognized by Linear Bounded Automaton.',
          'Type 2: context-free grammars → CFLs, recognized by PDA.',
          'Type 3: regular grammars → regular languages, recognized by DFA/NFA.',
          'Hierarchy is strict: Regular ⊂ CFL ⊂ CSL ⊂ Recursively Enumerable.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Closure property MSQs are extremely common — memorize the closure table for Regular, CFL, and Recursive languages separately.',
          'Distinguishing "language is not regular" (use pumping lemma / Myhill-Nerode) from "language is regular but proof needed" — always attempt to build a DFA first before reaching for pumping lemma.',
          'Undecidability proofs almost always reduce FROM the halting problem, not to it.',
        ],
      },
    ],
  },
  {
    key: 'cd',
    title: 'Compiler Design',
    color: '#ef4444',
    sections: [
      {
        heading: 'Lexical Analysis',
        bullets: [
          'Converts source code into tokens using regular expressions — implemented via DFA.',
          'Lexeme = actual substring matched; Token = category (id, keyword, number...); Pattern = rule describing the token.',
        ],
      },
      {
        heading: 'Parsing',
        bullets: [
          'Top-down: LL(1) — needs grammar without left recursion/ambiguity; uses FIRST and FOLLOW sets to build parse table.',
          'Bottom-up: LR family — LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ LR(1) in parsing power.',
          'FIRST(α): set of terminals that begin strings derivable from α (include ε if α can derive ε).',
          'FOLLOW(A): set of terminals that can appear immediately after A in some derivation (include $ if A can be the last symbol).',
          'Shift-reduce conflict and reduce-reduce conflict are the two main LR parsing conflicts — grammar ambiguity is a common cause.',
          'Left recursion (A→Aα|β) must be eliminated for LL parsers — standard elimination formula: A→βA\', A\'→αA\'|ε.',
        ],
      },
      {
        heading: 'Syntax-Directed Translation',
        bullets: [
          'Synthesized attributes: computed from children (bottom-up, evaluated in post-order).',
          'Inherited attributes: computed from parent/siblings (needs left-to-right or specific evaluation order).',
          'S-attributed grammars use only synthesized attributes — compatible with bottom-up parsing (easy).',
          'L-attributed grammars allow inherited attributes restricted to left siblings/parent — compatible with top-down parsing.',
        ],
      },
      {
        heading: 'Intermediate Code & Optimization',
        bullets: [
          'Three-address code: at most one operator per instruction, e.g. t1 = a + b.',
          'Common optimizations: constant folding, dead code elimination, common subexpression elimination, loop-invariant code motion, strength reduction.',
          'Basic block: straight-line code sequence with single entry, single exit, no internal branches.',
          'DAG representation of a basic block helps identify common subexpressions and dead code.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Computing FIRST/FOLLOW sets by hand is error-prone under time pressure — practice a consistent left-to-right, iterate-to-fixed-point method.',
          'LALR(1) merges states of LR(1) with same core — can introduce reduce-reduce conflicts not present in full LR(1).',
          'Grammar ambiguity ≠ language ambiguity — an ambiguous grammar might still describe an unambiguous language via a different (unambiguous) grammar.',
        ],
      },
    ],
  },
  {
    key: 'dl',
    title: 'Digital Logic',
    color: '#0ea5e9',
    sections: [
      {
        heading: 'Number Systems & Codes',
        bullets: [
          "1's complement: invert all bits; 2's complement: invert + add 1 — used for signed subtraction via addition.",
          'Gray code: only 1 bit changes between successive values — reduces switching errors in encoders.',
          'BCD: each decimal digit encoded in 4 bits (0000–1001); invalid combinations 1010–1111.',
        ],
      },
      {
        heading: 'Boolean Algebra & K-Maps',
        bullets: [
          "De Morgan's laws: (A+B)' = A'B', (AB)' = A'+B' — essential for NAND/NOR-only implementations.",
          'K-map grouping: groups must be powers of 2 (1,2,4,8...), adjacent cells differ by 1 bit (including wrap-around).',
          "Don't-care conditions (X) can be used or ignored in grouping — use them only if they help form a bigger group.",
          'SOP (sum of products) from 1s; POS (product of sums) from 0s.',
        ],
      },
      {
        heading: 'Combinational Circuits',
        bullets: [
          'Multiplexer: 2^n data inputs, n select lines, 1 output — can implement any Boolean function of n+1 variables.',
          'Decoder: n inputs → 2^n outputs, exactly one active — used for address/memory decoding.',
          'Half adder: Sum = A⊕B, Carry = AB. Full adder adds a Cin: Sum = A⊕B⊕Cin, Cout = AB + Cin(A⊕B).',
          'Priority encoder resolves multiple active inputs by giving output for the highest-priority one.',
        ],
      },
      {
        heading: 'Sequential Circuits',
        bullets: [
          'SR latch: invalid state when S=R=1 (in NOR-based implementation).',
          'JK flip-flop: fixes SR\'s invalid state — J=K=1 causes toggle.',
          'D flip-flop: output follows input at clock edge — used for pure storage/registers.',
          'T flip-flop: toggles when T=1 — used in counters.',
          'Mealy machine: output depends on state AND input (can change mid-clock-cycle).',
          'Moore machine: output depends only on current state (changes only at clock edge) — generally needs more states than an equivalent Mealy machine.',
        ],
      },
      {
        heading: 'Counters & Registers',
        bullets: [
          'Mod-N counter needs ⌈log₂N⌉ flip-flops minimum.',
          'Ripple (asynchronous) counter: simple but has propagation delay accumulation across stages.',
          'Synchronous counter: all flip-flops clocked together — faster, more complex control logic.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'K-map wrap-around (corners, edges) is frequently missed — always check top/bottom and left/right wrap adjacency.',
          'Mealy vs Moore state-count comparisons are a classic MSQ — Moore often needs one extra state to "remember" the output delay.',
          'Careful with "number of flip-flops" vs "number of states" — states can be encoded in fewer flip-flops than naive counting suggests.',
        ],
      },
    ],
  },
  {
    key: 'ds',
    title: 'Data Structures',
    color: '#14b8a6',
    sections: [
      {
        heading: 'Arrays, Stacks, Queues',
        bullets: [
          'Circular queue avoids the "shifting" problem of a linear queue on dequeue.',
          'Stack applications: expression evaluation/conversion (infix↔postfix↔prefix), recursion, backtracking, balanced parentheses.',
          'Postfix evaluation: scan left to right, push operands, pop two on operator, push result.',
        ],
      },
      {
        heading: 'Linked Lists',
        bullets: [
          'Singly linked list: O(1) insert/delete at head, O(n) at arbitrary position (need traversal to find predecessor).',
          'Doubly linked list: O(1) deletion given a node pointer (no predecessor traversal needed).',
          "Detecting a cycle: Floyd's Tortoise and Hare (slow/fast pointer) — meets inside the cycle if one exists.",
        ],
      },
      {
        heading: 'Trees',
        bullets: [
          'BST property: left subtree < node < right subtree — inorder traversal gives sorted order.',
          'AVL tree: balance factor ∈ {−1,0,1} at every node — rotations (LL, RR, LR, RL) restore balance after insert/delete.',
          'Height of a balanced BST with n nodes: O(log n); worst-case skewed BST: O(n).',
          'Number of distinct BSTs possible with n nodes = Catalan number Cₙ = (2n)!/((n+1)!n!).',
          'B-tree/B+ tree: used in databases/file systems for disk-friendly, shallow, balanced multi-way search.',
        ],
      },
      {
        heading: 'Heaps',
        bullets: [
          'Max-heap: parent ≥ children. Min-heap: parent ≤ children. Array representation: children of i are 2i+1, 2i+2 (0-indexed).',
          'Build-heap from an unsorted array: O(n), not O(n log n) — a classic surprising GATE fact (tighter amortized bound).',
          'Heap sort: O(n log n) worst-case, in-place, NOT stable.',
        ],
      },
      {
        heading: 'Graphs & Hashing',
        bullets: [
          'Adjacency matrix: O(V²) space, O(1) edge lookup. Adjacency list: O(V+E) space, better for sparse graphs.',
          'BFS uses a queue (level-order, shortest path in unweighted graphs); DFS uses a stack/recursion.',
          'Hashing collision resolution: chaining (linked lists per bucket) vs open addressing (linear/quadratic probing, double hashing).',
          'Load factor α = n/m (entries/buckets) — directly affects expected probe length.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Distinguish "number of BSTs" (Catalan number — structure only) from "number of distinct heaps" (different, larger count due to value placement freedom).',
          'AVL rotation direction: name rotation after the side that\'s heavy, then the shape of imbalance (LL, RR, LR, RL) — practice tracing, not memorizing outcomes.',
          'Recall array-based heap child/parent index formulas cold — a very common numerical building block.',
        ],
      },
    ],
  },
  {
    key: 'algorithms',
    title: 'Algorithms',
    color: '#d946ef',
    sections: [
      {
        heading: 'Asymptotic Analysis',
        bullets: [
          'Big-O: upper bound (worst case). Ω: lower bound (best case). Θ: tight bound (both).',
          "Master theorem: T(n) = aT(n/b) + f(n) — compare f(n) with n^(log_b a) to pick case 1/2/3.",
          'Recurrence for common patterns: binary search T(n)=T(n/2)+O(1) → O(log n); merge sort T(n)=2T(n/2)+O(n) → O(n log n).',
        ],
      },
      {
        heading: 'Divide and Conquer',
        bullets: [
          'Merge sort: O(n log n) always, stable, needs O(n) extra space.',
          'Quick sort: O(n log n) average, O(n²) worst (already-sorted with bad pivot); in-place, NOT stable.',
          "Strassen's matrix multiplication: O(n^2.81), better than naive O(n³).",
        ],
      },
      {
        heading: 'Greedy Algorithms',
        bullets: [
          "Kruskal's MST: sort edges, add if no cycle (Union-Find) — O(E log E).",
          "Prim's MST: grow tree from a start vertex, always add minimum-weight edge crossing the cut — O(E log V) with a heap.",
          "Dijkstra's shortest path: greedy + priority queue — fails with negative edge weights.",
          'Activity selection / interval scheduling: sort by finish time, greedily pick compatible activities.',
          "Huffman coding: greedy, builds optimal prefix-free code by repeatedly merging two lowest-frequency nodes.",
        ],
      },
      {
        heading: 'Dynamic Programming',
        bullets: [
          'DP applies when a problem has optimal substructure + overlapping subproblems.',
          '0/1 Knapsack: dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]]) — O(nW).',
          'LCS (Longest Common Subsequence): dp[i][j] = dp[i-1][j-1]+1 if match, else max(dp[i-1][j], dp[i][j-1]).',
          "Bellman-Ford: DP-based shortest path, handles negative weights, detects negative cycles — O(VE).",
          'Floyd-Warshall: all-pairs shortest path — O(V³), works with negative edges (no negative cycles).',
        ],
      },
      {
        heading: 'Graph Algorithms & Complexity Classes',
        bullets: [
          'Topological sort only exists for a DAG (no cycles) — via DFS finish-order or Kahn\'s (BFS/in-degree) algorithm.',
          'P: solvable in polynomial time. NP: verifiable in polynomial time. NP-complete: hardest problems in NP, all NP problems reduce to it.',
          'SAT was the first problem proven NP-complete (Cook-Levin theorem); common reductions: 3-SAT → Vertex Cover, Independent Set, Clique.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Master theorem edge cases (f(n) polynomially close to boundary but not matching) need the extended/Akra-Bazzi style reasoning — flag and skip if borderline under time pressure.',
          'Greedy vs DP confusion: fractional knapsack is greedy-optimal, but 0/1 knapsack is NOT — greedy fails there.',
          "Dijkstra fails with negative weights — this exact trap appears almost every year in some form.",
        ],
      },
    ],
  },
  {
    key: 'c',
    title: 'C Programming',
    color: '#f97316',
    sections: [
      {
        heading: 'Pointers',
        bullets: [
          'Pointer arithmetic scales by the size of the pointed-to type: p+1 moves sizeof(*p) bytes forward.',
          'Array name decays to a pointer to its first element in most expressions (not with sizeof or &array).',
          'Pointer to pointer (**p), function pointers, and pointer to array vs array of pointers are classic trace-the-output questions.',
          'Dangling pointer: points to freed/out-of-scope memory — using it is undefined behavior.',
        ],
      },
      {
        heading: 'Arrays, Strings, Structures',
        bullets: [
          '2D array access a[i][j] = base + (i×cols + j)×sizeof(type) — practice both row-major (C default) and column-major.',
          'String is a char array terminated by \\0 — strlen() does NOT count the null terminator, sizeof() on a char[] DOES.',
          'struct padding/alignment: compiler may insert padding bytes for alignment — sizeof(struct) is not always the sum of member sizes.',
          'Union: all members share the same memory — sizeof(union) = size of largest member.',
        ],
      },
      {
        heading: 'Recursion & Functions',
        bullets: [
          'Each recursive call gets its own stack frame — local variables are NOT shared across calls.',
          'Tail recursion can (in principle) be optimized to iteration, but GATE C usually assumes no such optimization unless stated.',
          'Pass by value (default in C) — a function cannot modify the caller\'s variable directly unless a pointer is passed.',
          'Static local variables retain their value across function calls (initialized only once).',
        ],
      },
      {
        heading: 'Tricky C Semantics',
        bullets: [
          'Operator precedence/associativity traps: ++, --, *, & mixed in one expression — evaluation order of operands is often unspecified in C.',
          'Short-circuit evaluation: && and || skip the second operand when the result is already determined — matters when the operand has side effects.',
          'Implicit type conversion: mixing int/float/char in expressions promotes to the "larger" type — watch for unexpected float results or truncation.',
          'Array of pointers to strings vs 2D char array — different memory layouts, different mutability of individual strings.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Trace pointer-heavy code very literally, one line at a time on paper — mental tracing is the #1 cause of silly mistakes here.',
          'Remember: order of evaluation of function arguments is unspecified in C — code relying on it (e.g. i++ + i++) is technically undefined behavior, but GATE sometimes still expects a specific compiler convention, so read the question\'s assumptions carefully.',
        ],
      },
    ],
  },
  {
    key: 'math',
    title: 'Engineering Mathematics (LA, Calculus, Probability, DM)',
    color: '#3b82f6',
    sections: [
      {
        heading: 'Linear Algebra',
        bullets: [
          'Rank of a matrix = number of linearly independent rows/columns; find via row echelon form.',
          'Eigenvalues: solve det(A − λI) = 0; sum of eigenvalues = trace(A), product of eigenvalues = det(A).',
          'A system Ax=b has a unique solution iff rank(A) = rank([A|b]) = n (number of unknowns).',
          'Symmetric matrices have real eigenvalues; orthogonal matrix: AᵀA = I, det = ±1.',
          'Rank-Nullity theorem: rank(A) + nullity(A) = number of columns of A.',
        ],
      },
      {
        heading: 'Calculus',
        bullets: [
          'Mean Value Theorem: f\'(c) = (f(b)-f(a))/(b-a) for some c ∈ (a,b), if f is continuous on [a,b] and differentiable on (a,b).',
          'Maxima/minima: f\'(x)=0 gives critical points; f\'\'(x)>0 → local min, f\'\'(x)<0 → local max.',
          'L\'Hôpital\'s rule applies to 0/0 or ∞/∞ indeterminate forms only — differentiate numerator and denominator separately.',
          'Partial derivatives and double integrals occasionally appear — practice order of integration and limits carefully.',
        ],
      },
      {
        heading: 'Probability & Statistics',
        bullets: [
          'Bayes\' theorem: P(A|B) = P(B|A)P(A) / P(B) — very common in GATE, practice with a probability tree.',
          'Expectation E[X] = Σx·P(x); Variance = E[X²] − (E[X])².',
          'Binomial distribution: P(X=k) = C(n,k) pᵏ(1-p)^(n-k), mean = np, variance = np(1-p).',
          'Independent events: P(A∩B) = P(A)P(B); mutually exclusive events: P(A∩B) = 0 (different concept — don\'t confuse the two).',
        ],
      },
      {
        heading: 'Discrete Mathematics',
        bullets: [
          'Propositional logic: know truth tables for →, ↔ especially — → is false only when premise true, conclusion false.',
          'Set theory & functions: injective (one-to-one), surjective (onto), bijective — and counting functions between finite sets.',
          'Group theory: closure, associativity, identity, inverse — a group also needs these 4; abelian group additionally needs commutativity.',
          'Graph theory: handshake lemma (Σdegrees = 2×edges); a tree with n vertices has exactly n−1 edges.',
          'Pigeonhole principle: n items into m boxes (n>m) means some box has ≥⌈n/m⌉ items — used in many "prove existence" arguments.',
          'Combinatorics: permutations vs combinations — order matters vs doesn\'t; practice with repetition allowed/not allowed cases.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Bayes\' theorem questions often bury the prior probability in wording ("1% of population has...") — extract given numbers into a table before computing.',
          'Rank/nullity and eigenvalue questions are much faster via properties (trace, determinant) than full computation — always check if a property shortcut applies first.',
          '"Mutually exclusive" and "independent" are NOT the same and are almost never both true simultaneously (except trivial cases) — a frequent conceptual MCQ trap.',
        ],
      },
    ],
  },
  {
    key: 'aptitude',
    title: 'Aptitude & Reasoning',
    color: '#ec4899',
    sections: [
      {
        heading: 'Quantitative — Core Formulas',
        bullets: [
          'Percentage change: ((New − Old)/Old) × 100.',
          'Profit/Loss: Profit% = (SP−CP)/CP × 100; for successive discounts, multiply the retained fractions, don\'t add percentages.',
          'Simple Interest = PRT/100; Compound Interest = P(1+R/100)ⁿ − P.',
          'Time & Work: if A does a job in x days, A\'s 1-day work = 1/x; combined work rates simply add.',
          'Speed/Time/Distance: relative speed — add speeds for opposite directions, subtract for same direction.',
          'Averages, mixtures & alligation: alligation rule = (Cheaper qty)/(Dearer qty) = (Dearer price − Mean)/(Mean − Cheaper price).',
        ],
      },
      {
        heading: 'Permutations, Combinations & Probability',
        bullets: [
          'nPr = n!/(n-r)! (order matters); nCr = n!/(r!(n-r)!) (order doesn\'t matter).',
          'Circular permutations of n distinct objects: (n-1)!.',
          'Basic probability = favorable outcomes / total outcomes — always define the sample space explicitly first.',
        ],
      },
      {
        heading: 'Data Interpretation',
        bullets: [
          'Always note the units/scale of a chart (e.g. "in thousands") before computing — a very common careless-error trap.',
          'For bar/line/pie combinations, compute one clean reference value first (e.g. total) and derive the rest from it, rather than recomputing from scratch each time.',
        ],
      },
      {
        heading: 'Logical Reasoning',
        bullets: [
          'Syllogisms: draw Venn diagrams for "All/Some/No" statement combinations rather than reasoning purely verbally.',
          'Blood relations & seating arrangements: draw the diagram/table as you read each clue — don\'t try to hold it all in your head.',
          'Coding-decoding: look for a consistent shift/pattern (letter position, reversal, etc.) across at least two examples before applying it.',
        ],
      },
      {
        heading: 'Verbal',
        bullets: [
          'Sentence completion / grammar: check subject-verb agreement and tense consistency first — most errors are there.',
          'Critical reasoning: identify the conclusion vs the premises before evaluating strengthen/weaken options.',
        ],
      },
      {
        heading: 'Common GATE traps',
        bullets: [
          'Successive percentage changes are multiplicative, not additive — a very frequently misapplied shortcut.',
          'In DI, questions are usually designed so exact arithmetic is unnecessary — look for approximation/elimination shortcuts to save time.',
          'Re-read the question stem after computing an answer — many aptitude traps are in what\'s actually being asked (e.g. "who is NOT..." vs "who is...").',
        ],
      },
    ],
  },
];
