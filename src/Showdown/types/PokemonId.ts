export type PokemonId = {
	player: 'p1' | 'p2' | 'p3' | 'p4';
	position?: 'a' | 'b';
	pokemon: string;
	name?: string;
	shiny?: boolean;
	gender?: 'M' | 'F' | undefined;
}