#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os
import population
import webapp2
import jinja2
import json
from google.appengine.ext import db


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class GeneticAlgorithm:
    def __init__(self, mutation_prob=.001, max_iterations=1000000):
        self.mutation_prob = mutation_prob
        self.max_iterations = max_iterations

    def find_solution(self, population):
        initial_pop = population
        print "Starting Algorithm - Mutation Probability: {} Max Iterations: {}".format(self.mutation_prob,
                                                                                        self.max_iterations)

        for i in range(self.max_iterations):
            population = population.breed(self.mutation_prob)
            if (population[0].cost == 0):
                print "Found in {} iterations".format(i)
                return True, (population[0]), format(i), str(initial_pop)
        print "No solution found"
        return False, population[0]


class Solutiondb(db.Model):
    num_of_queens = db.IntegerProperty(required=True)
    mutation_probability = db.FloatProperty(required=True)
    num_of_iteration = db.IntegerProperty(required=True)
    population_size = db.IntegerProperty(required=True)
    solution = db.StringProperty(required=True)


def get_solution(parameters):
    g = GeneticAlgorithm(parameters['mutation_prob'], parameters['max_iterations'])
    return g.find_solution(population.Population(parameters['nqueens'], parameters['population_size']))


class DownloadHandler(webapp2.RequestHandler):
    def get(self):
        string = """
All previous solutions are shown below.\n
The format of a line is as follows\n
<number_of_queens>:<mutation_probability>:<number_of_iterations_used_to_solve_the_problem>:<initial_population_size>:<solution>\n
Solution is shown as comma seperated values of queen positions.\n
"""
        q = Solutiondb.all()
        for p in q.run():
            string += "%s:%s:%s:%s:%s\n" % (p.num_of_queens,
                                            p.mutation_probability,
                                            p.num_of_iteration,
                                            p.population_size,
                                            p.solution)
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(string)


class MainHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render())

    def post(self):
        mutation_prob = float(self.request.get('mutation_prob'))
        max_iterations = int(self.request.get('max_iterations'))
        nqueens = int(self.request.get('nqueens'))
        population_size = int(self.request.get('population_size'))

        parameters = {'mutation_prob': mutation_prob,
                      'max_iterations': max_iterations,
                      'nqueens': nqueens,
                      'population_size': population_size}
        solution = get_solution(parameters)

        if solution[0]:
            output = {'found': "true",
                      'solution_list': str(solution[1])[1:-9],
                      'num_of_iterations': str(solution[2]),
                      'initial_pos_list': str(solution[3])}
            e = Solutiondb(mutation_probability=mutation_prob,
                           num_of_queens=nqueens,
                           num_of_iteration=int(solution[2]),
                           population_size=population_size,
                           solution=str(solution[1])[1:-9].replace(" ", ""))
            e.put()

        else:
            output = {'found': "false"}

        output = json.dumps(output)
        self.response.out.write(output)


app = webapp2.WSGIApplication([
                                  ('/', MainHandler), ('/download', DownloadHandler)
                              ], debug=True)
