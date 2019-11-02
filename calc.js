		/* Инкапсулирует, чтоб не передавать третий параметр */
		function sumBig(a, b) {
			return sumByCarrying(a, b, (Number.MAX_SAFE_INTEGER).toString().length - 1);  // -1 чтоб лишний разряд сложился
		}

		function sumByCarrying(a, b, positions) {
			let max = Math.max(a.length, b.length);
			let iterations = Math.ceil(Math.max(a.length / positions, b.length / positions));
			a = '0'.repeat(max - a.length) + a;
			b = '0'.repeat(max - b.length) + b;
			let result = [];
			let carry = 0;
			for (let i=1; i<=iterations; i++) {
				let _a = (i !== (iterations) || a.length % positions === 0) 
					? a.substr(a.length - i * positions, positions)
					: a.substr(0, a.length % positions);
				let _b = (i !== (iterations) || b.length % positions === 0) 
					? b.substr(a.length - i * positions, positions)
					: b.substr(0, b.length % positions);

				let sum = (+_a + +_b + carry).toString();
				if (sum.length > positions) {
					carry = +sum.substr(0, 1);
					sum = sum.substr(1, positions)
				}
				else {
					try {
					sum = '0'.repeat(positions - sum.length) + sum;
					} catch {debugger;}
					carry = 0;
				}
				
				result.push(sum);
			}
			if (carry !== 0) {
				result.push(carry);
			}
			result = result.reverse().join('');
			return result.substring(result.search(/[^0]/))
		}