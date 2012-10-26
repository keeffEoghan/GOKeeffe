/* Author: Eoghan O'Keeffe */

(function($) {
//	STYLE {
		$.standardiseCss('transition-duration');

		/*Modernizr.csstransforms = false;
		$('html').removeClass('csstransforms').addClass('no-csstransforms');*/
		
		var squareShape;

		if(Modernizr.csstransforms) {
			squareShape = function(e) {
				var $darkShape = $('#darkshape'), $contact = $('#contact'),
					cW = $contact.width(), cH = $contact.height(),
					minW = $(self).width()*0.3, minH = $(self).height(),
					minD = Math.max(minW, minH), cD = Math.max(cW, cH),

					diff = Math.max(0, cH-cW), d = cD+2*minD+2*minW,

					/* Half-square isoceles hypoteneuse: sqrt(1/2)*(contact width) == 0.7071*cw */
					s = 0.7071*d, offset = s/2,

					spx = s+'px', mpx = (minW+minD+diff/2)+'px';

				$darkShape.css({
					'width': spx, 'height': spx,
					'top': -offset+'px', 'left': -offset+'px'
				});

				$contact.css('padding', '0 '+mpx)
					.children('h1').css('min-width', minD+'px');

				// TODO: scroll to the old position?
			};

			$(self).on('resize.gok load.gok', throttle(squareShape));
			squareShape();
		}

		function resize(e) {
			var width = 0;

			$('.workreel').each(function() {
				var $this = $(this);

				width += parseInt($this.css('max-width')+
							$this.css('margin-left')+
							$this.css('margin-right'), 10);
			});
			$('#work').width(width);

			$('#what-next').css('padding-right',
				$('#contact').css('margin-right'));
		}

		$(self).on('resize.gok load.gok', throttle(resize));
		resize();


		$('#intro > .step, #what-next > .step').watchAppear('#main');


		var $prev;

		function stagger() {
			var $this = $(this),
				prevClass = $prev[0].className;

			prevClass.replace(/\b[r]([0-9])\b/, function(row, num) {
				var n = Number(num),
					// Go up or down 1 row
					r = ((n > 3 ||
						(n > 0 && Math.random() < 0.5))? -1 : 1);

				$this.addClass('r'+(n+r));
				$prev.addClass((r > 0)? 'down' : 'up');

				return n;
			});

			$prev = $this;
		}

		$prev = $('#intro > .step')
				.first().addClass('r'+Math.floor(Math.random()*5));

		$prev.nextAll('.step').each(stagger);

		var $bar = $('#main-bar').addClass('r2');

		$prev = $bar;
		$('#what-next > .step').each(stagger)
			.first().addClass($bar.hasClass('up')?
				'firstup' : 'firstdown');


		function openImageBox() {
			$('#main').css('overflow', 'hidden')
				.prevAll('nav').addClass('offscreen');

			$imageBox.removeClass('hidden');

			// Wait a frame to ensure transition happens on imageBox
			requestAnimationFrame(function() {
				$imageBox.add($reel.addClass('active');

				$(document).on('keydown.imageBox', navigateImages);

				$reel.css('right',
					(($reel.offset().left+$reel.outerWidth())-
						$(document).outerWidth())+'px');

				setTimeout(function() { $reel.addClass('right'); },
					((Modernizr.csstransitions)? 300 : 0));
			});
		}

		function closeImageBox() {
			var $reel = $('#work article.workreel.active'),
				$imageBox = $('#imagebox');

			$('#main').css('overflow', '')
				.prevAll('nav').removeClass('offscreen');
			$(document).off('keydown.imageBox');
			
			$reel.removeClass('right')
				.find('figure.selected').removeClass('selected');

			// To ensure the transition takes place on the reel after position change
			requestAnimationFrame(function() {
				$imageBox.removeClass('active');
				$reel.css('right', '');

				setTimeout(function() {
					$imageBox.addClass('hidden');
					$reel.removeClass('active');
				}, ((Modernizr.csstransitions)? 300 : 0));
			});
		}

		function closeWorkReel() {
			$('article.workreel.selected').removeClass('selected');
		}

		function navigateImages(e) {
			var $sel;

			switch(e.which) {
			case 27: // Esc
				closeImageBox();
			break;

			case 38: case 37: // Up, Right
				$sel = $('#work article.workreel.active figure.selected');

				var $prev = $sel.prev('figure');

				if(!$prev.length) {
					$prev = $sel.siblings('figure').last();
				}

				$prev.children('img').click()
					.end()[0].scrollIntoView();

				e.preventDefault();
			break;

			case 40: case 39: // Down, Left
				$sel = $('#work article.workreel.active figure.selected');

				var $next = $sel.next('figure');

				if(!$next.length) {
					$next = $sel.siblings('figure').first();
				}

				$next.children('img').click()
					.end()[0].scrollIntoView();

				e.preventDefault();
			break;
			}
		}

		/* To manipulate all elements without affecting this element or
			its ancestors: $(this).parents().andSelf().siblings().doStuff()
		*/

		$(document).on('click.gok', '#work article.workreel:not(.selected)', function(e) {
			var $this = $(this);

			$this.siblings('article.workreel.selected').andSelf()
				.toggleClass('selected');

			e.stopPropagation();
		})
		.on('click.gok', '#work article.workreel.selected img', function(e) {
			var $this = $(this),
				$fig = $this.parent(),
				$reel = $fig.parents('#work article.workreel'),
				$imageBox = $('#imagebox');

			if($fig.hasClass('selected')) { /*closeImageBox();*/ }
			else {
				if(!$reel.hasClass('active')) { openImageBox(); }

				$fig.siblings('figure.selected').andSelf()
						.toggleClass('selected');
			}

			/* TODO: update URL to reflect image open state */
		})
		.on('click.gok', '#work article.workreel.selected',
			function(e) { e.stopPropagation(); })
		.on('click.gok', function(e) {
			closeWorkReel();
			closeImageBox();
		});

		$('#imagebox').on('click.gok', function(e) {
			closeImageBox();
			e.stopPropagation();
		})
		.on('click.gok', 'img', function(e) {
			closeWorkReel();
			e.stopPropagation();
		});

		$('#contact').on('click.gok', '#form.closed', function(e) {
			$(this).removeClass('closed');
			setTimeout(function() { $(self).trigger('resize'); }, 501);
		});

		$('#main-bar, #false-step').on('click.gok', function(e) {
			if(e.target === this) {
				$('#form').toggleClass('closed');
				setTimeout(function() { $(self).trigger('resize'); }, 501);
				e.stopPropagation();
			}
		});

		/*$('#main-message, #extra-details').on('click.gok', function(e) {
			$(this).addClass('selected')
				.siblings('fieldset').removeClass('selected');
		});*/

		$('#email, #phone').on('blur.gok', function(e) {
			var $or = $(this).siblings('input').andSelf(),
				none = !$or.filter('[value!=""]').length;

			$or.prop('required', function() {
				return (none || !!(""+$(this).val()).length);
			});
		});

		$('#main').on('scroll.gok', throttle(function(e) {
			var $this = $(this),
				buffer = 2,
				width = $this.innerWidth(),
				left = $this.scrollLeft(),
				scrollWidth = this.scrollWidth,
				maxScroll = scrollWidth-width-buffer;

			if(left > maxScroll) {
				$this.scrollLeft(buffer);
			}
			else if(left < buffer) {
				$this.scrollLeft(maxScroll);
			}
		}));
		
		$('#main').on('mousewheel.gok DOMMouseScroll.gok', function(e) {
			var $this = $(this),
				override = true;

			if(this !== e.target) {
				$(e.target).parentsUntil(this).each(function() {
					return (override =
						($(this).css('overflow').search(/hidden|visible/) >= 0));
				});
			}

			if(override &&
				$this.css('overflow').search(/hidden|visible/) < 0) {
				var oe = e.originalEvent,
					wheel = (($.isNumeric(oe.wheelDelta))?
						-oe.wheelDelta : oe.detail*40);

				$this.scrollLeft($this.scrollLeft()+wheel);
				e.preventDefault();
			}
		});
//	}

//	UTIL {
		/* Static wrapper for apply
			Maintains the this value no matter how many times it's passed around
			Useful for callbacks */
		function invoke(object, func, args) {
			func.apply(object, Array.prototype.slice.call(arguments, 2));
		}

		/* Safer than inheriting from new Parent(), as Object.create
			circumvents the constructor, which could cause problems (needing
			a whole load of arguments, having throw clauses, etc) */
		function inherit(Child, Parent) {
			Child.prototype = Object.create(Parent.prototype);
			Child.prototype.constructor = Child;

			return Child;
		}

		/* Simple observable class: subscribe/unsubscribe with id and
			callback function, called on change */
		function Watchable(thing) {
			/* The observable thing - optional */
			this._thing = thing;
			
			/* A collection of callback functions provided by observers
			*	Key is an id representing the object observing this one
			*	Value is the callback function provided */
			this.callbacks = {};
			this.idGen = 0;
		}
		$.extend(Watchable.prototype, {
			update: function() {
				for(var c in this.callbacks) {
					var callback = this.callbacks[c];
					callback.func.apply(null, callback.args.concat(this._thing));
				}

				return this;
			},
			/* Get or set the value
				When the value is updated, all observers are notified,
				unless silent is set to true */
			thing: function(thing, silent) {
				if(thing !== undefined) {
					this._thing = thing;
					
					if(!silent) { this.update(); }
					
					return this;
				}
				else { return this._thing; }
			},
			
			/* Observe this object by providing the chosen callback,
				any arguments, and an id */
			watch: function(func, args) {
				var id = this.idGen++;
				this.callbacks[id] = { func: func,
					args: Array.prototype.slice.call(arguments, 1) };
				return id;
			},
			
			/* Stop observing this object
			*	If an id is provided, only the callback with that id is removed
			*	Otherwise, all callbacks are removed */
			unwatch: function(id) {
				if(id) { delete this.callbacks[id]; }
				else { this.callbacks = {}; }
				return this;
			}
		});


		function Vec2D(x, y) { this.x = (x || 0); this.y = (y || 0); }
		$.extend(Vec2D.prototype, {
			/* Accessors */
			
			add: function(other) { return this.copy().doAdd(other); },
			
			angleAbs: function(other) {
				var prodMag = Math.sqrt(this.mag2()*other.mag2());
				if(magProd) { return Math.acos(this.dot(other)/prodMag); }
				else { $.error("Vec2D Error: getting angle with zero vector"); }
			},
			
			angleRel: function(other) {
				return Math.atan2(this.dot(other.perp()), this.dot(other));
			},
			
			copy: function(other) {
				if(other) { this.x = other.x; this.y = other.y; return this; }
				else { return new this.constructor(this.x, this.y); }
			},
			
			dist: function(other) { return Math.sqrt(this.distSq(other)); },
			
			distSq: function(other) {
				var x = other.x-this.x, y = other.y-this.y; return x*x+y*y;
			},
			
			dot: function(other) { return this.x*other.x+this.y*other.y; },
			
			equals: function(other) {
				return (this.x === other.x && this.y === other.y);
			},

			pinToRange: function(min, max) {
				return this.copy().doPinToRange(min, max);
			},
			
			mag: function() { return Math.sqrt(this.magSq()); },
			
			magSq: function() { return this.x*this.x+this.y*this.y; },
			
			mult: function(other) { return this.copy().doMult(other); },
			
			perp: function() { return this.copy().doPerp(); },
			
			scale: function(m) { return this.copy().doScale(m); },
			
			sub: function(other) { return this.copy().doSub(other); },
			
			unit: function() { return this.copy().doUnit(); },
			
			/* Mutators */
			
			doAdd: function(other) { this.x += other.x; this.y += other.y; return this; },

			doPinToRange: function(min, max) {
				if(max < min) { log("Vec2D Warning: max value less than min value"); }
				var magSq = this.magSq(),
					limitSq = Math.pinToRange(min*min, magSq, max*max);
				
				if(magSq && magSq !== limitSq) {
					this.doUnit().doScale(Math.sqrt(limitSq));
				}
				return this;
			},
			
			doMult: function(other) { this.x *= other.x; this.y *= other.y; return this; },
			
			doPerp: function() {
				// Left
				var x = this.x; this.x = -this.y; this.y = x; return this;
			},
			
			doScale: function(m) { this.x *= m; this.y *= m; return this; },
			
			doSub: function(other) { this.x -= other.x; this.y -= other.y; return this; },
			
			doUnit: function() {
				var mag = this.mag();
				if(mag) { this.x /= mag; this.y /= mag; return this; }
				else { $.error("Vec2D Error: normalising zero vector"); }
			},
			
			doZero: function() { this.x = this.y = 0; return this; }
		});


		function AARect(pos, size) {
			this.pos = (pos || new Vec2D());
			this.size = (size || new Vec2D());
		}
		$.extend(AARect.prototype, {
			intersects: function(other) {
				return !(this.pos.x+this.size.x < other.pos.x ||
					this.pos.x > other.pos.x+other.size.x ||
					this.pos.y+this.size.y < other.pos.y ||
					this.pos.y > other.pos.y+other.size.y);
			},
			contains: function(other) {
				return (other.pos.x >= this.pos.x &&
					other.pos.x+other.size.x <= this.pos.x+this.size.x &&
					other.pos.y >= this.pos.y &&
					other.pos.y+other.size.y <= this.pos.y+this.size.y);
			},
			containingCircle: function() {
				return new Circle(new Vec2D(this.pos.x+this.size.x/2,
						this.pos.y+this.size.y/2),
					Math.max(this.size.x/2, this.size.y/2));
			},
			copy: function(other) {
				if(other) {
					this.pos.copy(other.pos);
					this.size.copy(other.size);
					return this;
				}
				else {
					return new this.constructor(this.pos.copy(), this.size.copy());
				}
			},
			trace: function(context) {
				context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
				return this;
			}
		});


		function Circle(pos, rad) {
			this.pos = (pos || new Vec2D());
			this.rad = (rad || 0);
			this.radSq = this.rad*this.rad;
		}
		$.extend(Circle.prototype, {
			intersects: function(other) {
				var radSum = this.rad+other.rad;
				return (this.pos.distSq(other.pos) <= radSum*radSum);
			},
			contains: function(other) {
				var radSub = this.rad-other.rad;
				return (radSub >= 0 && this.pos.distSq(other.pos) <= radSub*radSub);
			},
			radius: function(rad) {
				if($.isNumeric(rad)) {
					this.rad = rad;
					this.radSq = this.rad*this.rad;

					return this;
				}
				else { return this.rad; }
			},
			radiusSq: function(radSq) {
				if($.isNumeric(radSq)) {
					this.radSq = radSq;
					this.rad = Math.sqrt(this.radSq);

					return this;
				}
				else { return this.radSq; }
			},
			containingAARect: function() {
				var diam = 2*this.rad;
				return new AARect(
					new Vec2D(this.pos.x-this.rad, this.pos.y-this.rad),
					new Vec2D(diam, diam));
			},
			copy: function(other) {
				if(other) {
					this.pos.copy(other.pos); this.rad = other.rad;
					this.radSq = other.radSq; return this;
				}
				else {
					return new this.constructor(this.pos.copy(), this.rad);
				}
			},
			trace: function(context) {
				context.arc(this.pos.x, this.pos.y, this.rad, 0, 2*Math.PI);
				return this;
			}
		});

		
		function Enum() {
			for(var i = 0; i < arguments.length; ++i) { this[arguments[i]] = i; }
		}


		/* Quad Tree implementation based on Mike Chambers' - http://www.mikechambers.com/blog/2011/03/21/javascript-quadtree-implementation/ */
		/*
		The MIT License

		Copyright (c) 2011 Mike Chambers

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in
		all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		THE SOFTWARE.
		*/
		/* Operates on items with the structure { x, y } for Nodes
			and { x, y, width, height } for BoundsNodes */
		function QuadTree(boundRect, maxDepth, maxKids, source, converter, pointQuad) {
			this.root = ((pointQuad)?
					new Node(boundRect, 0, maxDepth, maxKids)
				:	new BoundsNode(boundRect, 0, maxDepth, maxKids));
			
			// Array of whatever the tree is populated from - generic, convenience
			this.source = (source || []);

			if(this.source.length) { this.put(source, converter); }
		}
		$.extend(QuadTree.prototype, {
			add: function(source) {
				if(source) { this.source = this.source.concat(source); }
				return this;
			},
			put: function(item, converter) {
				if(!item || $.isFunction(item)) { this.put(this.source, item); }
				else {
					if(converter) {
						if($.isArray(item)) {
							for(var i = 0; i < item.length; ++i) {
								this.put(item[i], converter);
							}
						}
						else { this.root.put(converter.call(null, item)); }
					}
					else { this.root.put(item); }
				}
				
				return this;
			},
			get: function(item) { return this.root.get(item).slice(0); },
			clear: function(item) { this.root.clear(item); return this; },
			remove: function(item) {
				if(item) {
					if($.isArray(item)) {
						for(var i = 0; i < item.length; ++i) {
							this.remove(item[i]);
						}
					}
					else if(!this.source.remove(item)) {
						//log("QuadTree Warning: item to be removed not found in source array");
					}
				}
				else { this.source.length = 0; }

				return this;
			},
			copy: function(converter) {
				return new QuadTree(this.boundRect.copy(), this.maxDepth,
						this.maxKids, this.source, converter,
						this.root instanceof BoundsNode);
			}
		});


		function Node(boundRect, depth, maxDepth, maxKids) {
			this.boundRect = boundRect;
			this.depth = depth;
			this.maxDepth = maxDepth;
			this.maxKids = maxKids;
			
			this.kids = [];
			this.nodes = [];
		}
		$.extend(Node.prototype, {
			put: function(item) {
				if(item) {
					if($.isArray(item)) {
						for(var i = 0; i < item.length; ++i) { this.put(item[i]); }
					}
					else if(this.nodes.length) {
						var node = this.nodesFor(item)[0];
						
						if(node) { node.put(item); }
					}
					else if(this.kids.push(item) > this.maxKids &&
						this.depth < this.maxDepth) {
						this.split().put(this.kids);
						this.kids.length = 0;
					}
				}
				
				return this;
			},
			get: function(item) {
				var kids = [];
				
				if(item) {
					if($.isArray(item)) {
						// May duplicate kids
						for(var i = 0; i < item.length; ++i) {
							kids = kids.concat(this.get(item[i]));
						}
					}
					else if(this.nodes.length) {
						var nodes = this.nodesFor(item);

						for(var n = 0; n < nodes.length; ++n) {
							kids = kids.concat(nodes[n].get(item));
						}
					}
					else { kids = kids.concat(this.kids); }
				}
				
				return kids;
			},
			clear: function(item) {
				if(item) {
					// Note: item here refers to the exact object stored in the tree
					if($.isArray(item)) {
						for(var i = 0; i < item.length; ++i) { this.clear(item[i]); }
					}
					else if(this.nodes.length) {
						var node = this.nodesFor(item)[0];

						if(node) {
							if(node.nodes.length) { node.clear(item); }
							else if(node.kids.remove(item)) {
								var nodeKids = 0;

								for(var l = 0; l < this.nodes.length; ++l) {
									var nL = this.nodes[l];

									// Don't merge if node still has subnodes
									if(nL.nodes.length) {
										nodeKids = Infinity;
										break;
									}
									else { nodeKids += nL.kids.length; }
								}

								if(nodeKids <= this.maxKids) { this.merge(); }
							}
							else {
								//log("QuadTree Warning: item to be cleared not found");
							}
						}
					}
					else if(!this.kids.remove(item)) {
						//log("QuadTree Warning: item to be cleared not found");
					}
				}
				else {
					this.kids.length = 0;
					
					for(var n = 0; n < this.nodes.length; ++n) {
						this.nodes[n].clear();
					}
					
					this.nodes.length = 0;
				}
				
				return this;
			},
			nodesFor: function(item) {
				var nodes = [];

				if(item) {
					if(!item.size) { item.size = new Vec2D(); }

					for(var n = 0; n < this.nodes.length; ++n) {
						var node = this.nodes[n];
						if(node.boundRect.contains(item)) {
							nodes.push(node);
							break;
						}
						else if(node.boundRect.intersects(item)) { nodes.push(node); }
					}
				}

				return nodes;
			},/*
			node: function(item) {
				var lR = ((item.pos.x <= this.boundRect.pos.x+this.boundRect.size.x/2)?
						"Left" : "Right"),
					tB = ((item.pos.y <= this.boundRect.pos.y+this.boundRect.size.y/2)?
						"top" : "bottom");

				return this.nodes[Node.corners[tB+lR]];
			},*/
			split: function() {
				var depth = this.depth+1,
					
					halfSize = new Vec2D((this.boundRect.size.x/2) | 0,
						(this.boundRect.size.y/2) | 0),
					
					rightHalf = this.boundRect.pos.x+halfSize.x,
					bottomHalf = this.boundRect.pos.y+halfSize.y;
				
				this.nodes[Node.corners.topLeft] = new this.constructor(
					new AARect(this.boundRect.pos.copy(), halfSize.copy()),
					depth, this.maxDepth, this.maxKids);
				
				this.nodes[Node.corners.topRight] = new this.constructor(
					new AARect(new Vec2D(rightHalf, this.boundRect.pos.y),
						halfSize.copy()), depth, this.maxDepth, this.maxKids);
				
				this.nodes[Node.corners.bottomLeft] = new this.constructor(
					new AARect(new Vec2D(this.boundRect.pos.x, bottomHalf),
						halfSize.copy()), depth, this.maxDepth, this.maxKids);
				
				this.nodes[Node.corners.bottomRight] = new this.constructor(
					new AARect(new Vec2D(rightHalf, bottomHalf), halfSize.copy()),
					depth, this.maxDepth, this.maxKids);
				
				return this;
			},
			merge: function() {
				for(var n = 0; n < this.nodes.length; ++n) {
					var node = this.nodes[n].merge();

					this.kids = this.kids.concat(node.kids);
					node.clear();
				}

				this.nodes.length = 0;

				return this;
			}
		});
		Node.corners = new Enum("topLeft", "topRight",
			"bottomLeft", "bottomRight");
		
		
		function BoundsNode(boundRect, depth, maxDepth, maxKids) {
			Node.apply(this, arguments);
			this.edgeKids = [];
		}
		BoundsNode.corners = Node.corners;
		$.extend(inherit(BoundsNode, Node).prototype, {
			put: function(item) {
				if(item) {
					if($.isArray(item)) {
						for(var i = 0; i < item.length; ++i) { this.put(item[i]); }
					}
					else if(this.nodes.length) {
						var nodes = this.nodesFor(item);
						
						if(nodes.length > 1) { this.edgeKids.push(item); }
						else if(nodes.length) { nodes[0].put(item); }
					}
					else if(this.kids.push(item) > this.maxKids &&
						this.depth < this.maxDepth) {
						this.split().put(this.kids);
						this.kids.length = 0;
					}
				}
				
				return this;
			},
			get: function(item) {
				var kids = [];
				
				if(item) {
					if($.isArray(item)) {
						// May duplicate kids
						for(var i = 0; i < item.length; ++i) {
							kids = kids.concat(this.get(item[i]));
						}
					}
					else {
						if(this.nodes.length) {
							var nodes = this.nodesFor(item);

							for(var n = 0; n < nodes.length; ++n) {
								kids = kids.concat(nodes[n].get(item));
							}
						}
						else { kids = kids.concat(this.kids); }

						kids = kids.concat(this.edgeKids);
					}
				}
				
				return kids;
			},
			clear: function(item) {
				if(item) {
					// Note: item here refers to the exact object stored in the tree
					if($.isArray(item)) {
						for(var i = 0; i < item.length; ++i) { this.clear(item[i]); }
					}
					else if(this.nodes.length) {
						var nodes = this.nodesFor(item), node = nodes[0];

						if(nodes.length > 1) {
							if(!this.edgeKids.remove(item)) {
								//log("QuadTree Warning: item to be cleared not found");
							}
						}
						else if(node) {
							if(node.nodes.length) { node.clear(item); }
							else if(node.kids.remove(item)) {
								var nodeKids = 0;

								for(var l = 0; l < this.nodes.length; ++l) {
									var nL = this.nodes[l];

									// Don't merge if node still has subnodes
									if(nL.nodes.length) {
										nodeKids = Infinity;
										break;
									}
									else { nodeKids += nL.kids.length; }
								}

								if(nodeKids <= this.maxKids) { this.merge(); }
							}
							else {
								//log("QuadTree Warning: item to be cleared not found");
							}
						}
					}
					else if(!this.kids.remove(item) && !this.edgeKids.remove(item)) {
						//log("QuadTree Warning: item to be cleared not found");
					}
				}
				else {
					this.edgeKids.length = 0;
					
					return Node.prototype.clear.call(this);
				}
				
				return this;
			},
			merge: function() {
				for(var n = 0; n < this.nodes.length; ++n) {
					var node = this.nodes[n].merge();
					
					this.kids = this.kids.concat(node.kids);
					this.edgeKids = this.edgeKids.concat(node.edgeKids);
					node.clear();
				}

				this.nodes.length = 0;

				return this;
			}
		});
//	}

//	PHYSICS {
		function Point(pos) { this.pos = pos || new Vec2D(); }

		/* See Game Physics Engine Development, by Ian Millington */
		function Particle(options) {
			if(!options) { options = {}; }
			
			Point.call(this, options.pos);

			this.vel = (options.vel || new Vec2D());
			this.acc = (options.acc || new Vec2D());
			this.force = (options.force || new Vec2D());
			
			if(options.mass) { this.mass(options.mass); }
			else { this.invMass = (($.isNumeric(options.invMass))?
						options.invMass : 1); }
			
			this.damping = (($.isNumeric(options.damping))?
				options.damping : 0.995);
			
			/* Previous few positions */
			this.trail = [];
			this.trailLimit = (($.isNumeric(options.trailLimit))?
				options.trailLimit : 5);
		}
		$.extend(inherit(Particle, Point).prototype, {
			resolve: function(dt) {
				if(dt) {
					this.updateTrail();
					
					/* Integrate */
					var resAcc = this.acc.add(this.force.scale(this.invMass))
						.doScale(dt);
					
					this.vel.doAdd(resAcc).doScale(Math.pow(this.damping, dt));
					
					this.pos.doAdd(this.vel.scale(dt));
					
					/* Reset */
					this.force.doZero();
				}
				
				return this;
			},
			mass: function(mass) {
				if(mass !== undefined) {
					this.invMass = 1/mass;
					return this;
				}
				else { return 1/this.invMass; }
			},
			updateTrail: function() {
				if(this.trail.unshift(this.pos.copy()) > this.trailLimit) {
					this.trail.splice(this.trailLimit);
				}

				return this;
			}
		});
//	}

//	INFLUENCES {
		var Force = {
			// Circle-led wander idea from Mat Buckland's Programming Game AI by Example
			// { Number range, Vec2D vel }
			wander: function(options) {
				/* range is proportional to the distance either side of the current
					heading within which the entity may wander (radius of wander circle)
					vel is the minimum velocity vector which wandering may produce
					(distance wander circle is ahead of the entity) */
				var random = (($.isNumeric(options.seed))?
							Math.seededRandom(options.seed)
						:	Math.random()),
					angle = random*2*Math.PI;
				return options.vel.add(new Vec2D(options.range*Math.cos(angle),
					options.range*Math.sin(angle)));
			},
			/* Adapted from Craig Reynolds' famous Boids - http://www.red3d.com/cwr/boids/
				and Harry Brundage's implementation, among others - http://harry.me/2011/02/17/neat-algorithms---flocking */
			// { QuadTree swarm, Particle member, Number nearbyRad, { Number separation, Number alignment, Number cohesion } weight, Number predict (o) }
			swarm: function(options) {
				var totalSeparation = new Vec2D(), totalCohesion = new Vec2D(),
					totalAlignment = new Vec2D(), swarm = new Vec2D(),
					
					predict = (options.predict || 0),
					focus = options.member.vel.scale(predict)
						.doAdd(options.member.pos),
					nearby = options.swarm.get((new Circle(focus,
							options.nearbyRad)).containingAARect()),
					
					num = 0;
				
				for(var n = 0; n < nearby.length; ++n) {
					var near = nearby[n].item;
					
					if(options.member !== near) {
						var nearbyFocus = near.vel.scale(predict)
								.doAdd(near.pos),
							vec = focus.sub(nearbyFocus),
							dist = vec.mag();

						if(dist < options.nearbyRad) {
							++num;

							var distFactor = options.nearbyRad/dist;
							totalSeparation.doAdd(vec.doUnit()
								.doScale(distFactor*distFactor));
							
							totalCohesion.doAdd(nearbyFocus).doSub(focus);
							
							var alignment = (near.angle ||
								((near.vel.magSq())?
									near.vel.unit() : null));
							
							if(alignment) { totalAlignment.doAdd(alignment); }
						}
					}
				}
				
				if(num) {
					swarm.doAdd(totalSeparation.doScale(options.weight.separation))
						.doAdd(totalCohesion.doScale(options.weight.cohesion))
						.doAdd(totalAlignment.doScale(options.weight.alignment))
						.doScale(1/num);
				}
				
				return swarm;
			}
		};
//	}
	
	/* TODO:
		- theme:
			- light up at start
		- plant:
			- recursive branching
			- tip particle:
				- seek light (global L->R)
				- wander
				- avoid edges
			- parent/children
			- branch chance
			- biomass (max thickness, constantly reducing, split upon branches, buds at min)
			- thickness (current thickness, drawn, grows to biomass over time)
			- bud (roulette between leaf, flower, seedhead, sucker(?), etc (and multiples)))
		- floating seeds:
			- particle:
				- wander
				- follow breeze (global L->R, with random variation in +-90)
		- fireflies:
			- particle:
				- swarm
				- seek guide (global L->R, with random variation in +-90)
				- wander
				- attracted to flowers (until full)
			- hunger
			- brightness (min, max, pulsating)
		- interaction:
			- pg-up/down skips sections
			- scrolling always slides to the next section after interaction, without annoying the user:
				- cannot directly detect scroll end
				- start very slowly and pick up speed if user doesn't keep scrolling?
				- have dummy scroll bar and use transforms instead (smoother)?
				- get rid of scroll bar and just use own nav elements (maybe with smooth transition)?
			- smoothen scrolling:
				- on scroll, negate it (remove transition, add transform), then reapply it (add transition, remove transform)
				- similar for javascript only (do benchmarks)?
			- nav
	*/

// TEXT BLOTTING {
	function BlotText(options) {
		var settings = $.extend(true, {}, BlotText.settings, options);

		this.$textElement = $(settings.textElement);

		this.$offCanvas = $('<canvas></canvas>');
		this.offCanvas = this.$offCanvas[0];
		this.offContext = this.offCanvas.getContext('2d');

		this.$onCanvas = $('<canvas class="blottext"></canvas>');
		this.onCanvas = this.$onCanvas[0];
		this.onContext = this.onCanvas.getContext('2d');
		this.$onCanvas.data('blotText', this);
		
		this.text = this.$textElement.text();
		this.font = this.$textElement.css("font");
		this.color = this.$textElement.css("color");
		this.width = this.$textElement.width();
		this.height = this.$textElement.height();

		this.canvas = settings.canvas;

		this.blots = [];
		this.numBlots = 0;
		this.blotRate = settings.blotRate;
		this.blot = settings.blot;

		this.blurRate = settings.blurRate;
		this.blurRad = settings.blurRad;

		this.fillArea = [];
		this.strokeMask = [];

		this.setup();
	}
	$.extend(BlotText.prototype, {
		setup: function() {
			this.offContext.width = this.onContext.width = this.width;
			this.offContext.height = this.onContext.height = this.height;
			this.offContext.strokeStyle = this.offContext.fillStyle = this.color;
			this.offContext.font = this.onContext.font = this.font;
			this.offContext.lineWidth = this.canvas.lineWidth;

			this.$textElement.after(this.$onCanvas
				.width(this.width).height(this.height));

			this.offContext.fillText(this.text, 0, 0);
			var imageData = this.offContext.getImageData(0, 0,
					this.width, this.height),
				data = imageData.data;

			// The starting indeces for each block present in the fill
			for(var af = 3, ld = imageData.data.length; af < ld; af += 4) {
				if(data[af] > 0) { this.fillArea.push(af-3); }
			}

			this.offContext.clearRect(0, 0, this.width, this.height);

			this.offContext.strokeText(this.text, 0, 0);

			imageData = this.offContext.getImageData(0, 0,
				this.width, this.height);
			data = imageData.data;

			// Check whether stroke is present at each fill index
			for(var s = 0, lf = this.strokeMask.length; s < lf; ++s) {
				this.strokeMask[s] = Math.ceil(data[this.fillArea[s]+3]);
			}

			this.offContext.clearRect(0, 0, this.width, this.height);

			return this;
		},
		resolve: function(dt) {
			this.numBlots += this.blotRate/1000*dt;

			var b = this.blot;

			for(n = Math.floor(this.numBlots); this.blots.length < n;) {
				this.blots.push(new Blot({
					pos: new Vec2D(Math.random()*this.width,
							Math.random()*this.height),
					growRate: b.growRate.min+Math.random()*
								(b.growRate.max-b.growRate.min),
					maxRad: b.maxRad.min+Math.random()*
								(b.maxRad.max-b.maxRad.min)
				}));
			}

			for(var br = 0; br < this.blots.length; ++br) {
				this.blots[br].resolve(dt);
			}

			return this;
		},
		draw: function() {
			for(var b = 0; b < this.blots.length; ++b) {
				this.blots[b].circle.trace(this.offContext);
			}

			this.offContext.fill();

			this.blur();

			// Setup - grab image data of filled text from blot canvas (for blur mask)

			// Blot canvas
			// Fill blots - source-over - having this first allows us to remove dead blots from the array
			// Stroke text - source-in

			// Blur - use image data from both blot+text canvasses (early-out if outside text area instead of text mask)

			// Text canvas
			// Put image data from blur

			/* Setup - grab image data of stroked and filled text from
				offscreen canvas (for blur masks, grab an array of indeces
				where alpha > 0 and only check those) */

			/* Offscreen canvas */
			/* Fill blots */

			/* Blur - use image data from both on- and off-screen canvasses
				early-out if outside text area instead of text masks */

			/* Onscreen canvas */
			/* Put image data from blur */

			return this;
		},
		blur: function() {
			var offData = this.offContext.getImageData(0, 0,
					this.width, this.height).data,
				onData = this.onContext.getImageData(0, 0,
					this.width, this.height).data,
				result = this.onContext.createImageData(this.width,
					this.height);

			for(var fA = this.fillArea, sM = this.strokeMask, c = this.rgba,
				f = 0, l = fA.length; f < l; ++f) {
				var fi = fA[f], s = sM[f];

				// Blur: add color from surrounding pixels


				// Fill out the result: fill&&min(blur(on)+(stroke&&off), color)
				result[fi] = Math.min(onData[fi]+offData[fi]*s, c[0]);
				result[fi+1] = Math.min(onData[fi+1]+offData[fi+1]*s, c[1]);
				result[fi+2] = Math.min(onData[fi+2]+offData[fi+2]*s, c[2]);
				result[fi+3] = Math.min(onData[fi+3]+offData[fi+3]*s, c[3]);
			}

			return result;
		},
		reset: function() {
			this.offCanvas.clearRect(0, 0, this.width, this.height);
			this.onCanvas.clearRect(0, 0, this.width, this.height);

			this.blots.length = 0;
			this.numBlots = 0;

			return this;
		},
		stop: function() { this.running = false; return this; }
	});
	BlotText.settings = {
		blotRate: 1,
		canvas: { lineWidth: 5 },
		blurRate: 2, blurRad: 3,
		blot: {
			growRate: { min: 0.1, max: 10 },
			maxRad: { min: 1, max: 100 }
		}
	};

	function BlotTextTest(options) {
		var settings = $.extend(true, {}, BlotTextTest.settings, options);

		this.$textElement = $(settings.textElement);

		this.$blotCanvas = $('<canvas></canvas>');
		this.blotCanvas = this.$blotCanvas[0];
		this.blotContext = this.blotCanvas.getContext('2d');

		this.$blurCanvas = $('<canvas></canvas>');
		this.blurCanvas = this.$blurCanvas[0];
		this.blurContext = this.blurCanvas.getContext('2d');

		this.$onCanvas = $('<canvas class="blottext"></canvas>');
		this.onCanvas = this.$onCanvas[0];
		this.onContext = this.onCanvas.getContext('2d');
		this.$onCanvas.data('blotText', this);

		// Blot canvas
		// Fill blots - source-over - having this first allows us to remove dead blots from the array
		// Stroke text - destination-in - acts as mask

		// Blur canvas
		// Copy from blot canvas - source-over
		// Get image data and blur - source-over
		// Fill text - destination-in - acts as mask

		// On canvas
		// Put image data from blur canvas - no visible redrawing
		
		this.text = this.$textElement.text();
		this.font = this.$textElement.css("font");
		this.color = this.$textElement.css("color");
		this.width = this.$textElement.width();
		this.height = this.$textElement.height();

		this.canvas = settings.canvas;

		this.blots = [];
		this.numBlots = 0;
		this.blotRate = settings.blotRate;
		this.blot = settings.blot;

		this.blurRate = settings.blurRate;
		this.blurRad = settings.blurRad;

		this.setup();
	}
	$.extend(BlotTextTest.prototype, {
		setup: function() {
			this.blotContext.width = this.blurContext.width =
				this.onContext.width = this.width;
			this.blotContext.height = this.blurContext.width =
				this.onContext.height = this.height;

			this.blotContext.fillStyle = this.blotContext.strokeStyle =
				this.color;

			this.blotContext.font = this.onContext.font = this.font;
			this.blotContext.lineWidth = this.canvas.lineWidth;

			this.$textElement.after(this.$onCanvas
				.width(this.width).height(this.height));

			return this;
		},
		resolve: function(dt) {
			this.numBlots += this.blotRate/1000*dt;

			var b = this.blot;

			for(n = Math.floor(this.numBlots); this.blots.length < n;) {
				this.blots.push(new Blot({
					pos: new Vec2D(Math.random()*this.width,
							Math.random()*this.height),
					growRate: b.growRate.min+Math.random()*
								(b.growRate.max-b.growRate.min),
					maxRad: b.maxRad.min+Math.random()*
								(b.maxRad.max-b.maxRad.min)
				}));
			}

			for(var br = 0; br < this.blots.length; ++br) {
				this.blots[br].resolve(dt);
			}

			return this;
		},
		draw: function() {
			// Blot canvas
			// Fill blots - source-over - having this first allows us to remove dead blots from the array
			// Stroke text - destination-in - acts as mask
			this.blotContext.globalCompositeOperation = 'source-over';

			for(var b = 0; b < this.blots.length; ++b) {
				this.blots[b].circle.trace(this.blotContext);
			}

			this.blotContext.fill();

			this.blotContext.globalCompositeOperation = 'destination-in';
			this.blotContext.strokeText(this.text, 0, 0);

			// Blur canvas
			// Copy from blot canvas - source-over
			// Get image data and blur - source-over
			// Fill text - destination-in - acts as mask
			this.blurCanvas.putImageData(this.blur());

			this.blurCanvas.globalCompositeOperation = 'destination-in';
			this.blurCanvas.fillText(this.text, 0, 0);

			// On canvas
			// Put image data from blur canvas
			this.onCanvas.putImageData(this.blurCanvas
					.getImageData(0, 0, this.width, this.height), 0, 0);

			return this;
		},
		blur: function() {
			var blotData = this.blotContext.getImageData(0, 0,
								this.width, this.height).data,
				blurData = this.blurContext.getImageData(0, 0,
								this.width, this.height).data,
				result = this.onContext.createImageData(this.width,
								this.height);

			for(var p = 0, l = this.width*this.height*4, c = this.color;
				p < l; p += 4) {
				// Blur: add color from surrounding pixels

				result[p] = Math.min(blurData[p]+offData[p], c[0]);
				result[p+1] = Math.min(blurData[p+1]+offData[p+1], c[1]);
				result[p+2] = Math.min(blurData[p+2]+offData[p+2], c[2]);
				result[p+3] = Math.min(blurData[p+3]+offData[p+3], c[3]);
			}

			return result;
		},
		reset: function() {
			this.blotCanvas.clearRect(0, 0, this.width, this.height);
			this.blurCanvas.clearRect(0, 0, this.width, this.height);
			this.onCanvas.clearRect(0, 0, this.width, this.height);

			this.blots.length = 0;
			this.numBlots = 0;

			return this;
		},
		stop: function() { this.running = false; return this; }
	});
	BlotTextTest.settings = {
		blotRate: 1,
		canvas: { lineWidth: 5 },
		blurRate: 2, blurRad: 3,
		blot: {
			growRate: { min: 0.1, max: 10 },
			maxRad: { min: 1, max: 100 }
		}
	};

	function Blot(options) {
		this.circle = new Circle(options.pos, options.rad);
		this.growRate = (options.growRate || 5);
		this.maxRad = (options.maxRad || 50);
	}
	$.extend(Blot.prototype, {
		resolve: function(dt) {
			this.circle.rad = Math.min(this.maxRad,
				this.circle.rad+this.growRate*dt);

			return this;
		}
	});
// }

// MAIN {
	function GOK() {
		this.time = Date.now();

		var gok = this;
		
		requestAnimationFrame(function() { gok.step(); });
	}
	$.extend(GOK.prototype, {
		step: function() {
			var currentTime = Date.now(), dt = currentTime-this.time;
			
			this.time = currentTime;

			for(var b = 0; b < this.blotTexts.length; ++b) {
				this.blotTexts[b].resolve(dt);
			}

			var gok = this;

			requestAnimationFrame(function() { gok.step(); });
		}
	});
	
	$(function(e) {
		$('#main .blotText').watchAppear('#main', {
				appear: function() { $(this).data('blotText').reset(); },
				disappear: function() { $(this).data('blotText').stop(); }
			});

		setTimeout(function() { $('body').removeClass('loading'); }, 1000);
	});
// }
})(jQuery);

function test1() {
	$.standardiseCss('transform', 'transition', 'perspective');
	$('#main').css('perspective', '400px');
	$('.workreel:eq(2)').parentsUntil('#main').andSelf()
		.siblings().css({ 'transition': 'all 0.6s ease',
			'transform': 'translate3d(0, 0, -100px)' });
}

function test2() {
	$.standardiseCss('transform', 'transition', 'perspective');
	$('#main').css('perspective', '400px');
	$('.workreel:eq(2)').siblings()
		.css({ 'transition': 'all 0.6s ease',
			'transform': 'translate3d(0, 0, -100px)' });
	$('.workreel:eq(2)').parentsUntil('#main').siblings()
		.css({ 'transition': 'all 0.6s ease',
			'transform': 'translate3d(0, 0, -100px)' });
}

/* Closest - reduce opacity for other sections, then do this */
function test3() {
	$.standardiseCss('transform', 'transition', 'perspective');
	$('#main').css('perspective', '400px');
	$('.workreel:eq(2)').siblings()
		.css({ 'transition': 'all 0.6s ease',
			'transform': 'translate3d(0, 0, -100px)' });
}

function test4() {
	$.standardiseCss('transform', 'transition', 'perspective');
	$('#main').css('perspective', '400px').children()
		.css({ 'transition': 'all 0.6s ease',
			'transform': 'translate3d(0, 0, -100px)' });

	$('.workreel:eq(2)').css({ 'transition': 'all 0.6s ease',
			'transform': 'translate3d(0, 0, 100px)' });
}