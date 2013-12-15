#!/usr/bin/env python
#
#   This work is free. You can redistribute it and/or modify it under the
#   terms of the Do What The Fuck You Want To Public License, Version 2,
#   as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
#

import chromosome
import random


class Population:
    def __init__(self, num_queens=8, population_size=10):
        self.num_queens = num_queens
        self.population_size = population_size
        self.population = self.generatePopulation()
        print "Population - Num Queens: {} Population Size: {}".format(self.num_queens, self.population_size)

    def generatePopulation(self):
        population = []
        for index in range(self.population_size):
            population.append(chromosome.Chromosome.random(self.num_queens))
        population.sort()

        return population

    def breed(self, mutation_prob=.001):
        touny = random.sample(self, 3)
        touny.sort()

        new_c = chromosome.Chromosome.fromParents(touny[0], touny[1])
        new_c.mutate(mutation_prob)

        self.replaceChromosome(new_c, touny[2])
        return self

    def replaceChromosome(self, new_c, old_c):
        self.population.append(new_c)
        self.population.remove(old_c)
        self.population.sort()

    def sort(self):
        self.population.sort()

    def __str__(self):
        return "\n".join([str(chromosome) for chromosome in self.population])

    def __len__(self):
        return len(self.population)

    def __getitem__(self, index):
        return self.population[index]


if __name__ == "__main__":
    print Population()
